
import React, { useRef, useEffect, useState } from 'react';
import { ChatMessage } from '../types';
import { PaperclipIcon, SparklesIcon, SendIcon, RobotAvatar, UserAvatar, TrashIcon } from './icons';
import { MarkdownRenderer } from './MarkdownRenderer';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, files: File[]) => void;
  isLoading: boolean;
  hasStarted: boolean;
  error: string | null;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading, hasStarted, error }) => {
  const [inputText, setInputText] = useState('');
  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const MAX_IMAGES = 6;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages, isLoading, pendingImages]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setPendingImages(prev => {
          const combined = [...prev, ...newFiles];
          return combined.slice(0, MAX_IMAGES);
      });
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemovePendingImage = (index: number) => {
      setPendingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e?: React.FormEvent) => {
      e?.preventDefault();
      if ((inputText.trim() || pendingImages.length > 0) && !isLoading) {
          onSendMessage(inputText.trim(), pendingImages);
          setInputText('');
          setPendingImages([]);
      }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (isLoading) return;
    
    const items = e.clipboardData?.items;
    if (!items) return;

    const newFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          newFiles.push(file);
        }
      }
    }

    if (newFiles.length > 0) {
        e.preventDefault();
        setPendingImages(prev => {
            const combined = [...prev, ...newFiles];
            return combined.slice(0, MAX_IMAGES);
        });
    }
  };
  
  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-[30px] text-red-700 text-lg shadow-lg">
        {error}
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white">
        <div className="bg-cyan-50 p-6 rounded-full mb-6">
             <SparklesIcon />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">Market Situation & Trade Plans</h3>
        <p className="text-lg text-gray-500 mt-3 max-w-md leading-relaxed">
            Upload up to 6 charts at once to get a comprehensive trade plan and analysis of the current market situation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white overflow-hidden rounded-2xl">
      
      {/* Header */}
      <div className="bg-cyan-600 p-6 flex items-center gap-4 shadow-md z-10">
        <div className="relative">
            <RobotAvatar />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-cyan-600 rounded-full"></div>
        </div>
        <div className="text-white">
            <h2 className="text-lg font-semibold leading-tight">ChartSense Bot</h2>
            <p className="text-cyan-100 text-sm font-medium">Market Situation Analyst</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-6 space-y-6 overflow-y-auto custom-scrollbar bg-white">
        {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const imageCount = msg.imagePreviewUrls?.length || 0;
            const hasImages = imageCount > 0;

            // Determine grid columns based on image count for better aesthetics
            let gridColsClass = 'grid-cols-1';
            if (imageCount === 2) gridColsClass = 'grid-cols-2';
            if (imageCount >= 3) gridColsClass = 'grid-cols-3';

            return (
                <div key={msg.id} className={`flex items-end gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    
                    {!isUser && <RobotAvatar />}

                    <div className={`relative px-5 py-4 max-w-[85%] md:max-w-[80%] shadow-sm text-lg 
                        ${isUser 
                            ? 'bg-cyan-50 text-gray-900 border border-cyan-200 rounded-2xl rounded-br-none' 
                            : 'bg-gray-50 text-gray-800 border border-gray-200 rounded-2xl rounded-bl-none'
                        }`}
                    >
                        {hasImages && (
                            <div className={`mb-4 grid gap-2 ${gridColsClass}`}>
                                {msg.imagePreviewUrls!.map((url, idx) => (
                                    <div key={idx} className="rounded-xl overflow-hidden border border-gray-200 bg-white">
                                        <img src={url} alt={`upload-${idx}`} className="w-full h-auto object-contain aspect-video" />
                                    </div>
                                ))}
                            </div>
                        )}
                        {msg.content && (
                             <MarkdownRenderer content={msg.content} />
                        )}
                    </div>

                    {isUser && <UserAvatar />}
                </div>
            );
        })}
        
        {isLoading && (
           <div className="flex items-end gap-3 justify-start">
             <RobotAvatar />
             <div className="px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl rounded-bl-none shadow-sm">
                <div className="flex gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0s'}}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}}></div>
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}}></div>
                </div>
             </div>
           </div>
        )}
         <div ref={messagesEndRef} />
      </div>
      
      {/* Input Area */}
      <div className="p-5 bg-white border-t border-gray-100">
        
        {/* Pending Images Preview */}
        {pendingImages.length > 0 && (
            <div className="mb-4 flex items-center gap-3 overflow-x-auto pb-3 custom-scrollbar">
                {pendingImages.map((file, idx) => (
                    <div key={idx} className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-300 group shadow-sm bg-gray-50">
                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={() => handleRemovePendingImage(idx)}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                ))}
                {pendingImages.length < MAX_IMAGES && (
                     <button 
                        onClick={handleUploadClick}
                        className="shrink-0 w-24 h-24 rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-cyan-600 hover:border-cyan-400 transition-colors bg-gray-50"
                     >
                        <span className="text-2xl font-bold">+</span>
                        <span className="text-[10px] font-semibold uppercase">Add Chart</span>
                     </button>
                )}
            </div>
        )}

        <div className="relative flex items-center gap-2">
             <button
                onClick={handleUploadClick}
                disabled={isLoading}
                className={`p-3 rounded-full transition-all duration-200 ${pendingImages.length > 0 ? 'bg-cyan-100 text-cyan-700' : 'text-gray-400 hover:text-cyan-600 hover:bg-gray-100'}`}
                title="Upload Charts (Max 6)"
            >
                <PaperclipIcon />
            </button>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileChange}
            />
            
            <div className="flex-1 relative">
                <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onPaste={handlePaste}
                    placeholder={pendingImages.length > 0 ? "Generate market situation & trade plan..." : "Type here or paste up to 6 charts..."}
                    disabled={isLoading}
                    className="w-full pl-6 pr-14 py-4 bg-gray-100 text-gray-800 placeholder-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:bg-white transition-all text-lg"
                />
                <button 
                    onClick={() => handleSubmit()}
                    disabled={(!inputText.trim() && pendingImages.length === 0) || isLoading}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-cyan-600 text-white rounded-full hover:bg-cyan-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-md transform hover:scale-105 active:scale-95"
                >
                    <SendIcon />
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
