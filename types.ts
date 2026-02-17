
export interface KeyIndicator {
  indicator: string;
  signal: string;
  details: string;
}

export interface AnalysisResponse {
  verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  confidence: number;
  analysisSummary: string;
  keyIndicators: KeyIndicator[];
  tradingDecision: 'BUY' | 'SELL' | 'HOLD';
  entryPrice?: number;
  stopLoss: number;
  takeProfit: number;
  riskManagement: string;
  disclaimer: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content?: string;
  imagePreviewUrls?: string[];
}

export type Timeframe = '1H' | '15M' | '5M' | '3M' | '1M';
