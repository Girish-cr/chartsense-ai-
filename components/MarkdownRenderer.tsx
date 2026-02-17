import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '' }) => {
  if (!content) return null;

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  let currentList: React.ReactNode[] = [];
  
  const flushList = (keyPrefix: string) => {
      if (currentList.length > 0) {
          elements.push(
              <ul key={`${keyPrefix}-list`} className="list-disc list-outside ml-5 space-y-1 mb-2 opacity-90 text-base text-gray-700">
                  {currentList}
              </ul>
          );
          currentList = [];
      }
  };

  const processInline = (text: string): React.ReactNode[] => {
      // Split by bold (**...**) and italic (*...*)
      // Captures: **text** OR *text*
      const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
      
      return parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
              return <strong key={index} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
          }
          if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
              return <em key={index} className="italic text-gray-800 font-medium">{part.slice(1, -1)}</em>;
          }
          return <span key={index}>{part}</span>;
      });
  };

  lines.forEach((line, index) => {
      const trimmed = line.trim();
      
      if (!trimmed) {
          flushList(`line-${index}`);
          return;
      }

      // Headers: Catch #, ##, ###, ####, etc.
      const headerMatch = trimmed.match(/^(#{1,6})\s+(.*)/);
      if (headerMatch) {
          flushList(`line-${index}`);
          const level = headerMatch[1].length;
          const text = headerMatch[2];
          
          // Dynamic sizing based on header level
          let classes = "font-bold text-gray-900 mt-4 mb-2 ";
          if (level === 1) classes += "text-xl";
          else if (level === 2) classes += "text-lg";
          else if (level === 3) classes += "text-base";
          else classes += "text-sm uppercase tracking-wide text-gray-600"; // h4, h5, h6

          elements.push(<div key={`h-${index}`} className={classes}>{processInline(text)}</div>);
          return;
      }

      // List Items
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
          const content = trimmed.replace(/^[\*\-]\s+/, '');
          currentList.push(
              <li key={`li-${index}`} className="pl-1 text-base leading-relaxed">
                  {processInline(content)}
              </li>
          );
          return;
      }

      // Regular Paragraphs
      flushList(`line-${index}`);
      elements.push(<p key={`p-${index}`} className="mb-3 leading-relaxed text-base text-gray-700">{processInline(trimmed)}</p>);
  });
  
  flushList('final');

  return <div className={`markdown-content ${className}`}>{elements}</div>;
};