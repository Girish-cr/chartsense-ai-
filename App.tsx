
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisDisplay } from './components/AnalysisDisplay';
import { ChatInterface } from './components/ChatInterface';
import { AuthPage } from './components/AuthPage';
import { analyzeChartStatic, createChatSession, verifyChartTimeframe, handleGeminiError } from './services/geminiService';
import { AnalysisResponse, ChatMessage, Timeframe } from './types';
import { AnalyzeIcon, DocumentIcon, ChatBubbleIcon, HeroChartIcon } from './components/icons';
import { Chat } from '@google/genai';

type ImageState = {
  file: File;
  base64: string;
  previewUrl: string;
  mimeType: string;
} | null;

type ActiveTab = 'static' | 'chat';

const App: React.FC = () => {
  // Auth state
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Multi-timeframe image state
  const [images, setImages] = useState<Record<Timeframe, ImageState>>({
    '1H': null,
    '15M': null,
    '5M': null,
    '3M': null,
    '1M': null,
  });
  const [activeUploadTab, setActiveUploadTab] = useState<Timeframe>('1H');

  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Upload verification state
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('static');
  
  // Chat state
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [hasChatStarted, setHasChatStarted] = useState<boolean>(false);

  const timeframeTabs: { id: Timeframe; label: string; fullLabel: string; required: boolean }[] = [
      { id: '1H', label: '1 Hour', fullLabel: '1 Hour Chart (High Timeframe)', required: true },
      { id: '15M', label: '15 Min', fullLabel: '15 Minute Chart (Mid Timeframe)', required: true },
      { id: '5M', label: '5 Min', fullLabel: '5 Minute Chart (Mid/Low Transition)', required: false },
      { id: '3M', label: '3 Min', fullLabel: '3 Minute Chart (Low Timeframe)', required: true },
      { id: '1M', label: '1 Min', fullLabel: '1 Minute Chart (Hyper Scalping)', required: false }
  ];

  const validateUploads = (): string | null => {
      const missing = timeframeTabs
          .filter(t => t.required && !images[t.id])
          .map(t => t.label);
      
      if (missing.length > 0) {
          return `Required charts missing: ${missing.join(', ')}. Please upload them to proceed with the Top-Down analysis.`;
      }
      return null;
  };

  const fileToGenerativePart = (base64: string, mimeType: string) => {
    return {
      inlineData: { data: base64, mimeType },
    };
  };

  const handleImageUpload = (file: File) => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    setUploadError(null);
    setIsVerifying(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      const mimeType = file.type;
      
      try {
          // Perform AI Verification
          const verification = await verifyChartTimeframe(base64String, mimeType, activeUploadTab);
          
          if (!verification.isValid) {
              setUploadError(`Incorrect Timeframe Detected: ${verification.reason}`);
              setIsVerifying(false);
              return;
          }

          const newImageState = {
            file,
            base64: base64String,
            previewUrl: URL.createObjectURL(file),
            mimeType: mimeType,
          };

          setImages(prev => ({
            ...prev,
            [activeUploadTab]: newImageState
          }));

          // Reset analysis states when a new image is uploaded
          setAnalysis(null);
          setError(null);
          setChatMessages([]);
          setChatSession(null);
          setHasChatStarted(false);
          setChatError(null);
          
      } catch (err: any) {
          console.error("Verification failed", err);
          setUploadError(err.message || "Unable to verify chart. Please try again.");
      } finally {
          setIsVerifying(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearImage = () => {
    const currentImage = images[activeUploadTab];
    if (currentImage) {
      URL.revokeObjectURL(currentImage.previewUrl);
    }
    
    setImages(prev => ({
        ...prev,
        [activeUploadTab]: null
    }));
    
    setUploadError(null);
    setAnalysis(null);
    setError(null);
    setChatMessages([]);
    setChatSession(null);
    setHasChatStarted(false);
    setChatError(null);
  };

  const handleAnalyzeDetailed = useCallback(async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    const validationError = validateUploads();
    if (validationError) {
        setError(validationError);
        return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const serviceImages: Partial<Record<Timeframe, { base64: string, mimeType: string }>> = {};
      Object.keys(images).forEach((key) => {
          const tf = key as Timeframe;
          if (images[tf]) {
              serviceImages[tf] = { base64: images[tf]!.base64, mimeType: images[tf]!.mimeType };
          }
      });

      const result = await analyzeChartStatic(serviceImages);
      setAnalysis(result);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'An error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  }, [images, user]);
  
  const handleStartChat = useCallback(async () => {
    if (!user) {
      setShowAuth(true);
      return;
    }

    const validationError = validateUploads();
    if (validationError) {
        setChatError(validationError);
        return;
    }
    
    setHasChatStarted(true);
    setIsStreaming(true);
    setChatError(null);

    try {
        const newChat = createChatSession();
        setChatSession(newChat);

        const initialPreviews: string[] = [];
        const parts: any[] = [];
        
        // Accurate Multi-Image Preparation
        const activeCharts = [
            { tf: '1H', label: '1 Hour (HTF)' },
            { tf: '15M', label: '15 Minute (MTF)' },
            { tf: '5M', label: '5 Minute (Mid)' },
            { tf: '3M', label: '3 Minute (LTF)' },
            { tf: '1M', label: '1 Minute (Scalp)' }
        ].filter(item => !!images[item.tf as Timeframe]);

        activeCharts.forEach((item, index) => {
            const img = images[item.tf as Timeframe]!;
            initialPreviews.push(img.previewUrl);
            parts.push({ text: `CHART ${index + 1} of ${activeCharts.length} - ${item.label}:` });
            parts.push(fileToGenerativePart(img.base64, img.mimeType));
        });

        const initialUserMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: 'Please analyze these charts for a high-precision market situation report and trade plan.',
            imagePreviewUrls: initialPreviews
        };

        setChatMessages([initialUserMessage]);

        let prompt = "Conduct a high-precision Top-Down analysis. Cross-check all candle lows against Y-axis values for accuracy.";
        if (analysis) {
            prompt += `\n\nReference Analysis Context:\n${JSON.stringify(analysis)}`;
        }
        parts.push({ text: prompt });

        const stream = await newChat.sendMessageStream({ message: parts });

        let currentModelMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            content: '',
        };
        setChatMessages(prev => [...prev, currentModelMessage]);

        for await (const chunk of stream) {
            currentModelMessage.content += chunk.text;
            setChatMessages(prev => prev.map(msg => msg.id === currentModelMessage.id ? { ...currentModelMessage } : msg));
        }

    } catch (e: any) {
        console.error(e);
        let errorMsg = e?.message || "Failed to start session.";
        setChatError(errorMsg);
    } finally {
        setIsStreaming(false);
    }
}, [images, analysis, user]);


const handleSendMessage = useCallback(async (text: string, files: File[]) => {
    if (!chatSession) {
        setChatError("Chat session not initialized.");
        return;
    }

    if (!text.trim() && files.length === 0) return;

    setIsStreaming(true);
    setChatError(null);

    const processAndSend = async (filesData: { base64: string, mimeType: string, previewUrl: string }[]) => {
        try {
            const userMessage: ChatMessage = {
                id: Date.now().toString(),
                role: 'user',
                content: text,
                imagePreviewUrls: filesData.map(f => f.previewUrl)
            };
            setChatMessages(prev => [...prev, userMessage]);

            const parts: any[] = [];
            if (text.trim()) parts.push({ text: text });

            // Precision labeling for new uploads in chat
            filesData.forEach((fileData, idx) => {
                 parts.push({ text: `Additional Analysis Image ${idx + 1}:` });
                 parts.push(fileToGenerativePart(fileData.base64, fileData.mimeType));
            });

            const stream = await chatSession.sendMessageStream({
                message: parts.length === 1 && text.trim() ? text : parts
            });

            let currentModelMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'model',
                content: '',
            };
            setChatMessages(prev => [...prev, currentModelMessage]);

            for await (const chunk of stream) {
                currentModelMessage.content += chunk.text;
                setChatMessages(prev => prev.map(msg => msg.id === currentModelMessage.id ? { ...currentModelMessage } : msg));
            }

        } catch (e: any) {
            console.error(e);
            let errorMsg = e?.message || "Error sending message.";
            setChatError(errorMsg);
        } finally {
            setIsStreaming(false);
        }
    };

    if (files.length > 0) {
        const filePromises = files.map(file => {
            return new Promise<{ base64: string, mimeType: string, previewUrl: string }>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    const previewUrl = URL.createObjectURL(file);
                    resolve({ base64: base64String, mimeType: file.type, previewUrl });
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(filePromises).then(results => {
            processAndSend(results);
        }).catch(() => {
            setChatError("Failed to process images.");
            setIsStreaming(false);
        });
    } else {
        processAndSend([]);
    }
}, [chatSession]);


  const mainButtonAction = activeTab === 'static' ? handleAnalyzeDetailed : handleStartChat;
  const isMainButtonDisabled = isLoading || (activeTab === 'chat' && isStreaming);

  const handleAuthComplete = (userData: { email: string }) => {
    setUser(userData);
    setShowAuth(false);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <Header user={user} onAuthClick={() => setShowAuth(true)} onLogout={() => setUser(null)} />
      
      {showAuth && (
        <AuthPage onAuthComplete={handleAuthComplete} onClose={() => setShowAuth(false)} />
      )}

      <main className="w-full max-w-[1800px] mx-auto p-4 md:p-6 lg:p-8">
        {!user && (
          <div className="mb-8 p-8 bg-cyan-600 rounded-[2rem] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-cyan-600/20">
            <div className="max-w-xl">
              <h2 className="text-4xl font-extrabold mb-4 leading-tight">Precision Chart Analysis for Modern Traders.</h2>
              <p className="text-cyan-50 text-xl font-medium mb-6">Unlock Top-Down institutional reasoning powered by AI. Sign up to start analyzing your first chart.</p>
              <button 
                onClick={() => setShowAuth(true)}
                className="px-8 py-4 bg-white text-cyan-600 font-bold rounded-xl shadow-lg hover:bg-cyan-50 transition-all transform hover:scale-105 active:scale-95"
              >
                Join for Free
              </button>
            </div>
            <div className="hidden md:block w-72 h-72 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 p-8">
               <div className="w-full h-full bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                  <HeroChartIcon />
               </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 h-full">
            <div className="flex items-center justify-between">
                 <h2 className="text-xl font-semibold text-gray-900">1. Upload Charts</h2>
                 {!user && <span className="text-xs font-bold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-2 py-1 rounded">Auth Required</span>}
            </div>
            
            <div className="flex flex-wrap gap-2 bg-white">
                {timeframeTabs.map((tab) => {
                    const hasData = !!images[tab.id];
                    const isActive = activeUploadTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setUploadError(null);
                                setActiveUploadTab(tab.id);
                            }}
                            className={`flex-1 py-3 px-1 text-[13px] font-semibold rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 whitespace-nowrap ${
                                isActive 
                                ? 'bg-cyan-600 text-white shadow-md transform scale-[1.02]' 
                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 font-medium'
                            }`}
                        >
                           {tab.label}
                           {hasData && <span className="w-2 h-2 rounded-full bg-green-400"></span>}
                        </button>
                    );
                })}
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                 <h3 className="text-lg font-semibold text-gray-800 mb-4 truncate">
                    {timeframeTabs.find(t => t.id === activeUploadTab)?.fullLabel}
                 </h3>
                 {uploadError && (
                    <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm font-medium">
                        {uploadError}
                    </div>
                 )}
                 <ImageUploader 
                    onImageUpload={handleImageUpload}
                    onClearImage={handleClearImage}
                    imagePreviewUrl={images[activeUploadTab]?.previewUrl || null}
                    isVerifying={isVerifying}
                 />
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Select Mode</h2>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => setActiveTab('static')}
                        className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left flex flex-row items-center gap-4 ${
                            activeTab === 'static' 
                            ? 'bg-cyan-50 border-cyan-200 ring-1 ring-cyan-400' 
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`p-3 w-fit rounded-xl shrink-0 ${activeTab === 'static' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-500'}`}>
                            <DocumentIcon />
                        </div>
                        <div className="min-w-0">
                            <p className={`font-bold text-base truncate ${activeTab === 'static' ? 'text-gray-900' : 'text-gray-700'}`}>Static Report</p>
                            <p className="text-xs text-gray-500 font-medium leading-tight mt-0.5">High Precision (Gemini 2.5 Flash)</p>
                        </div>
                    </button>

                    <button
                        onClick={() => setActiveTab('chat')}
                         className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left flex flex-row items-center gap-4 ${
                            activeTab === 'chat' 
                            ? 'bg-cyan-50 border-cyan-200 ring-1 ring-cyan-400' 
                            : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        <div className={`p-3 w-fit rounded-xl shrink-0 ${activeTab === 'chat' ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-500'}`}>
                            <ChatBubbleIcon />
                        </div>
                        <div className="min-w-0">
                            <p className={`font-bold text-base truncate ${activeTab === 'chat' ? 'text-gray-900' : 'text-gray-700'}`}>Live Analysis</p>
                            <p className="text-xs text-gray-500 font-medium leading-tight mt-0.5">Real-time reasoning & chat</p>
                        </div>
                    </button>
                </div>
            </div>

            <button
                onClick={mainButtonAction}
                disabled={isMainButtonDisabled}
                className="w-full py-5 bg-gradient-to-r from-gray-900 to-gray-800 hover:from-black hover:to-gray-900 text-white text-lg font-semibold rounded-xl shadow-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3 mt-2"
            >
                {isLoading || (activeTab === 'chat' && isStreaming && !hasChatStarted) ? (
                    <span className="flex items-center gap-2">Analyzing...</span>
                ) : (
                    <>
                        <AnalyzeIcon />
                        {activeTab === 'static' ? 'Generate Report' : 'Start Session'}
                    </>
                )}
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border-0 h-[800px] overflow-hidden relative flex flex-col">
             <div className="flex-1 overflow-hidden relative">
                 {activeTab === 'static' ? (
                     <div className="h-full overflow-y-auto custom-scrollbar p-2 md:p-6">
                        <AnalysisDisplay analysis={analysis} isLoading={isLoading} error={error} />
                     </div>
                 ) : (
                     <ChatInterface 
                        messages={chatMessages}
                        onSendMessage={handleSendMessage}
                        isLoading={isStreaming}
                        hasStarted={hasChatStarted}
                        error={chatError}
                     />
                 )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
