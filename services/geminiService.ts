
import { GoogleGenAI, Type, Chat } from "@google/genai";
import { AnalysisResponse, Timeframe } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const SYSTEM_INSTRUCTION = `You are ChartSense, an expert, data-driven market analyst. Your sole purpose is to perform rigorous technical analysis of the provided financial chart images using the Gemini 2.5 Flash reasoning capabilities.

**Analysis Logic (Top-Down Approach):**
If multiple charts are provided representing different timeframes, you must strictly follow this hierarchy:
1. **1 Hour (HTF)**: Analyze this first to establish the overall trend (Bullish/Bearish), identify major Swing Highs/Lows, and key Support/Resistance zones.
2. **15 Min (MTF)**: Analyze second to identify the current market structure and trend strength.
3. **5 Min (Mid/LTF Transition)**: Analyze third for more granular structure, identifying intermediate price reversals or pullbacks.
4. **3 Min (LTF)**: Analyze fourth to find precise entry points, breakout levels, Stop Loss (SL), and Take Profit (TP) zones.
5. **1 Min (Scalp)**: Analyze last to check for micro-structure confirmation, order flow imbalances, or hyper-scalping opportunities.

Your analysis MUST be based ONLY on the visual information within the charts. Do not use external knowledge. Ensure consistency. Convert the visual data into a thorough, actionable trading decision. Provide clear, structured JSON output. Always include disclaimers.`;

const CHAT_SYSTEM_INSTRUCTION = `You are ChartSense AI, powered by Gemini 2.5 Flash, a ultra-high-precision interactive market analyst. 

**PRECISION PROTOCOL (MANDATORY):**
1. **Numerical Audit**: Before providing any price level (Entry, SL, TP), you must perform a "Coordinate Cross-Check". Visually trace the candle wick to the Y-axis. 
2. **Numerical Comparison**: The API logic has been updated to perform a precise numerical comparison by explicitly checking the candle’s low against the exact expected value. You must apply this: if a candle low is $100.05 and the support is $100.00, you must acknowledge the 0.05 gap.
3. **Confluence Check**: Only suggest a trade plan if at least 2 timeframes show aligned signals (e.g., 15M structure break + 5M/3M retest).

**Core Mission:**
When a user uploads multiple charts (up to 6), your priority is to provide:
1. **Current Market Situation**: A summary of what is happening across all provided charts/timeframes (1H, 15M, 5M, 3M, 1M).
2. **Trade Plan**: A concrete plan including Entry Zone, Stop Loss, and Take Profit targets.

**Operational Guidelines:**
- Use the 1H chart for macro trend, 15M/5M for structure, 3M for execution, and 1M for micro-confirmation.
- If data is blurry or price levels are unclear, ask for clarification instead of guessing.
- Be clear, conversational, and surgically precise with numbers. Utilize your thinking budget to verify calculations before responding.`;


const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    verdict: { 
      type: Type.STRING, 
      description: "Overall market sentiment verdict based on top-down analysis. Must be one of: BULLISH, BEARISH, NEUTRAL."
    },
    confidence: { 
      type: Type.NUMBER,
      description: "Confidence level for the verdict, from 0.0 to 1.0."
    },
    analysisSummary: {
      type: Type.STRING,
      description: "A concise summary of the technical analysis, specifically referencing the interaction between 1H, 15M, 5M, 3M, and 1M if available."
    },
    keyIndicators: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          indicator: { type: Type.STRING },
          signal: { type: Type.STRING },
          details: { type: Type.STRING }
        },
        required: ["indicator", "signal", "details"],
      },
      description: "List of key technical indicators observed across timeframes."
    },
    tradingDecision: {
      type: Type.STRING,
      description: "A clear, actionable trading decision. Must be one of: BUY, SELL, HOLD."
    },
    entryPrice: {
      type: Type.NUMBER,
      description: "Suggested entry price for the trade. Can be null for market orders."
    },
    stopLoss: {
      type: Type.NUMBER,
      description: "Suggested stop-loss price to manage risk."
    },
    takeProfit: {
      type: Type.NUMBER,
      description: "Suggested take-profit price."
    },
    riskManagement: {
      type: Type.STRING,
      description: "General advice on risk management for this trade."
    },
    disclaimer: {
      type: Type.STRING,
      description: "Standard financial disclaimer."
    },
  },
  required: [
    "verdict", "confidence", "analysisSummary", "keyIndicators", 
    "tradingDecision", "stopLoss", "takeProfit", "riskManagement", "disclaimer"
  ]
};

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

interface ImageInput {
  base64: string;
  mimeType: string;
}

export const handleGeminiError = (e: any) => {
    const msg = e?.message?.toLowerCase() || e?.toString().toLowerCase() || '';
    const status = e?.status || e?.response?.status;
    
    if (status === 429 || msg.includes('429') || msg.includes('exhausted') || msg.includes('quota') || msg.includes('too many requests')) {
        if (msg.includes('daily') || msg.includes('day') || msg.includes('limit exceeded')) {
             throw new Error("Your daily request quota has been exhausted. Please try again after 12:00 AM PT.");
        }
        throw new Error("Your minute-wise request quota has been exhausted. Please try again after 1 minute.");
    }
    throw e;
};

export const verifyChartTimeframe = async (base64: string, mimeType: string, expectedTimeframe: string): Promise<{ isValid: boolean; reason: string }> => {
    const prompt = `You are a strict financial chart validator.
    Analyze the provided image to verify if it matches the expected timeframe: "${expectedTimeframe}".
    
    Timeframe Mapping Reference:
    - "1H" -> Looks for "1h", "H1", "60m", "1 Hour"
    - "15M" -> Looks for "15m", "M15", "15 Minutes"
    - "5M" -> Looks for "5m", "M5", "5 Minutes"
    - "3M" -> Looks for "3m", "M3", "3 Minutes"
    - "1M" -> Looks for "1m", "M1", "1 Minute"
    
    Logic:
    1. Scan the image for any visible text labels indicating the timeframe (usually in top corners).
    2. If you find an EXPLICIT label that CONTRADICTS the expected timeframe (e.g., you see "15m" but expected "1H"), return isValid: false.
    3. If you find an EXPLICIT label that MATCHES, return isValid: true.
    4. If NO explicit text label is found, return isValid: true (give the user the benefit of the doubt).
    5. If the image is NOT a financial chart at all, return isValid: false.
    
    Return strictly JSON.`;
  
    try {
        const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
            { inlineData: { data: base64, mimeType } },
            { text: prompt }
            ]
        },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
            type: Type.OBJECT,
            properties: {
                isValid: { type: Type.BOOLEAN },
                reason: { type: Type.STRING }
            },
            required: ["isValid", "reason"]
            }
        }
        });
        
        const text = response.text;
        return JSON.parse(text);
    } catch (e) {
        console.error("Validation parse error", e);
        const msg = (e as any)?.message?.toLowerCase() || '';
        if (msg.includes('429') || msg.includes('exhausted') || msg.includes('quota')) {
             return { isValid: true, reason: "Verification skipped due to high traffic." };
        }
        return { isValid: true, reason: "Validation service unavailable, proceeding." };
    }
  }

export const analyzeChartStatic = async (images: Partial<Record<Timeframe, ImageInput>>): Promise<AnalysisResponse> => {
  const parts: any[] = [];
  
  const tfOrder: Timeframe[] = ['1H', '15M', '5M', '3M', '1M'];
  const tfLabels: Record<string, string> = {
      '1H': '1 Hour Chart (HTF: Trend & Major Levels)',
      '15M': '15 Minute Chart (MTF: Structure & Sentiment)',
      '5M': '5 Minute Chart (Mid: Structural Transition)',
      '3M': '3 Minute Chart (LTF: Entry & Execution)',
      '1M': '1 Minute Chart (Scalp: Micro-Structure)'
  };

  tfOrder.forEach(tf => {
      if (images[tf]) {
          parts.push({ text: `--- ${tfLabels[tf]} ---` });
          parts.push(fileToGenerativePart(images[tf]!.base64, images[tf]!.mimeType));
      }
  });
  
  if (parts.length === 0) {
      throw new Error("No images provided for analysis.");
  }

  parts.push({ text: "Perform a thorough Top-Down technical analysis using the provided charts. Trace all price levels to the Y-axis and perform a numerical comparison for candle lows. Provide your output in the structured JSON format requested." });
  
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash', 
        contents: { parts },
        config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
        temperature: 0.1,
        thinkingConfig: { thinkingBudget: 4000 }
        }
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as AnalysisResponse;
  } catch (e) {
    handleGeminiError(e);
    console.error("Failed to parse JSON response:", e);
    throw new Error("Received an invalid format from the API.");
  }
};

export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: CHAT_SYSTEM_INSTRUCTION,
      temperature: 0.1, // Ultra-low temperature for maximum precision
      thinkingConfig: { thinkingBudget: 4000 } // High thinking budget for deep numerical verification
    }
  });
};
