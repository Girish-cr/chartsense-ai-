import React from 'react';
import { AnalysisResponse, KeyIndicator } from '../types';
import { LoadingIcon, ChartIcon } from './icons';
import { MarkdownRenderer } from './MarkdownRenderer';

interface AnalysisDisplayProps {
  analysis: AnalysisResponse | null;
  isLoading: boolean;
  error: string | null;
}

const VerdictPill: React.FC<{ verdict: 'BULLISH' | 'BEARISH' | 'NEUTRAL' }> = ({ verdict }) => {
  const baseClasses = "px-3 py-1 text-xs font-bold rounded-full text-white shadow-sm tracking-wide uppercase";
  const colorClasses = {
    BULLISH: "bg-green-600",
    BEARISH: "bg-red-600",
    NEUTRAL: "bg-yellow-500",
  };
  return <span className={`${baseClasses} ${colorClasses[verdict]}`}>{verdict}</span>;
};

const IndicatorTable: React.FC<{ indicators: KeyIndicator[] }> = ({ indicators }) => (
  <div className="overflow-x-auto border border-gray-200 rounded-lg">
    <table className="w-full text-left text-gray-600">
      <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b border-gray-200 tracking-wider">
        <tr>
          <th scope="col" className="px-4 py-3 font-semibold">Indicator</th>
          <th scope="col" className="px-4 py-3 font-semibold">Signal</th>
          <th scope="col" className="px-4 py-3 font-semibold">Details</th>
        </tr>
      </thead>
      <tbody>
        {indicators.map((ind, i) => (
          <tr key={i} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors last:border-0">
            <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap text-base">{ind.indicator}</th>
            <td className="px-4 py-3 text-base font-medium">{ind.signal}</td>
            <td className="px-4 py-3 text-base">{ind.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);


const StructuredDisplay: React.FC<{ data: AnalysisResponse }> = ({ data }) => (
  <div className="space-y-5">
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-semibold text-gray-900">Verdict</h3>
            <VerdictPill verdict={data.verdict} />
        </div>
        <p className="text-base text-gray-500">Confidence: <span className="font-semibold text-gray-900">{(data.confidence * 100).toFixed(0)}%</span></p>
    </div>
    
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Analysis Summary</h3>
        <div className="text-base text-gray-700 leading-relaxed">
             <MarkdownRenderer content={data.analysisSummary} />
        </div>
    </div>

    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Trading Plan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-cyan-700 uppercase font-bold tracking-wider mb-1">Decision</p>
                <p className="text-xl font-bold text-gray-900">{data.tradingDecision}</p>
            </div>
             <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-green-700 uppercase font-bold tracking-wider mb-1">Take Profit</p>
                <p className="text-xl font-bold text-gray-900">{data.takeProfit}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-yellow-700 uppercase font-bold tracking-wider mb-1">Entry</p>
                <p className="text-xl font-bold text-gray-900">{data.entryPrice ?? 'Market'}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs text-red-700 uppercase font-bold tracking-wider mb-1">Stop Loss</p>
                <p className="text-xl font-bold text-gray-900">{data.stopLoss}</p>
            </div>
        </div>
    </div>
    
    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Indicators</h3>
      <IndicatorTable indicators={data.keyIndicators} />
    </div>

    <div className="p-6 bg-white border border-gray-200 rounded-xl shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">Risk Management</h3>
        <div className="text-base text-gray-700 leading-relaxed">
             <MarkdownRenderer content={data.riskManagement} />
        </div>
    </div>

    <div className="p-4 bg-blue-50 border-l-4 border-yellow-500 rounded-r-lg">
        <p className="text-xs text-blue-900 font-medium leading-relaxed">{data.disclaimer}</p>
    </div>
  </div>
);


export const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ analysis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl">
        <div className="scale-110 mb-4">
             <LoadingIcon />
        </div>
        <p className="text-xl font-semibold mt-6 text-gray-900">ChartSense is analyzing...</p>
        <p className="text-base text-gray-500 mt-2">This may take a few moments.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center p-8 bg-red-50 border border-red-200 rounded-xl text-red-700 text-base font-medium">
        {error}
      </div>
    );
  }
  
  if (!analysis) {
      return (
      <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-white">
        <div className="bg-cyan-50 p-6 rounded-full mb-6">
             <ChartIcon />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900">Ready for Analysis</h3>
        <p className="text-lg text-gray-500 mt-3 max-w-md leading-relaxed">
            Upload a chart and click "Analyze Chart" to get an AI-powered technical breakdown and trading recommendation.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-[400px]">
      <StructuredDisplay data={analysis} />
    </div>
  );
};
