
import React from 'react';

export const AppLogo = () => (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9">
        <g id="Chart">
            <rect fill="#8c9eff" height="13" rx="1" ry="1" width="6" x="5" y="17"></rect>
            <rect fill="#8c9eff" height="17" rx="1" ry="1" width="6" x="21" y="13"></rect>
            <rect fill="#8c9eff" height="24" rx="1" ry="1" width="6" x="13" y="6"></rect>
            <path fill="#5f7cf9" d="M27,14a1,1,0,0,0-.29-.71L21,17.66V29a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1Z"></path>
            <path fill="#5f7cf9" d="M13,23.77V29a1,1,0,0,0,1,1h4a1,1,0,0,0,1-1V19.19Z"></path>
            <path fill="#5f7cf9" d="M5.27,29.68A1,1,0,0,0,6,30h4a1,1,0,0,0,1-1V25.3Z"></path>
        </g>
    </svg>
);

export const ChartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

export const UploadIcon = () => (
    <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
    </svg>
);

export const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

export const AnalyzeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

export const LoadingIcon = () => (
    <svg className="animate-spin h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
    </svg>
);

export const SparklesIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-.259-1.035z" />
    </svg>
);

export const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
  </svg>
);

export const RobotAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-cyan-100 shrink-0 overflow-hidden">
     <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" className="w-full h-full" preserveAspectRatio="xMidYMid meet" fill="#000000">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <path fill="#ffffff" d="M0 0h64v64H0z"></path>
            <path fill="#52c18e" d="M58.7 5.3h-5.6L37.3 25.5l-9.6-11.2L0 54.5V64h6.4l22.2-32.3l9.2 10.6l20.9-26.8z"></path>
            <path d="M64 0H0v50.7l3-4.3h-.9V33.1h10l1.5-2.1H2.1V17.6h13.3v10.7l2.1-3.1v-7.6h5.2l1.5-2.1h-6.7V2.1h13.3v12.7l2.4 2.8h7.5l1.7-2.1H33V2.1h13.3v8.3l2.1-2.7V2.1h13.3v13.3h-1.1v.8l-1 1.3h2.1v13.3H49.3l-2.9 3.8v11.7H33.1V40L31 37.5v8.7h-9.8l-1.5 2.1H31v13.3H17.6V51.5l-2.1 3.1v7.3h-5L9 64h55V0M15.5 15.5H2.1V2.1h13.3c.1 0 .1 13.4.1 13.4m30.9 46.4H33.1V48.5h13.3v13.4m15.5 0H48.5V48.5h13.3v13.4m15.5 0H48.5V33.1h13.3v13.3z" fill="#ffffff"></path>
        </g>
    </svg>
  </div>
);

export const UserAvatar = () => (
  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 shrink-0">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
    </svg>
  </div>
);

export const DocumentIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

export const ChatBubbleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
  </svg>
);

export const HeroChartIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <g id="Rank">
      <path fill="#96ccee" d="M5.14,15.79a.55.55,0,0,0-.55-.55h-2a.55.55,0,0,0-.55.55v4.45H5.14Z"></path>
      <path fill="#96ccee" d="M10.76,11.36a.55.55,0,0,0-.55-.55h-2a.55.55,0,0,0-.55.55v8.88h3.14Z"></path>
      <path fill="#96ccee" d="M16.38,9.15a.55.55,0,0,0-.55-.55h-2a.55.55,0,0,0-.55.55V20.24h3.14Z"></path>
      <path fill="#96ccee" d="M22,6.93a.55.55,0,0,0-.55-.55h-2a.55.55,0,0,0-.55.55V20.24H22Z"></path>
      <path fill="#f94060" d="M4.66,13.18a1.09,1.09,0,1,1-1.09-1.09,1.08,1.08,0,0,1,1.09,1.09"></path>
      <path fill="#f94060" d="M10.27,8.73A1.08,1.08,0,1,1,9.19,7.64a1.08,1.08,0,0,1,1.08,1.09"></path>
      <path fill="#f94060" d="M15.89,6.51a1.08,1.08,0,1,1-1.08-1.08,1.08,1.08,0,0,1,1.08,1.08"></path>
      <path fill="#f94060" d="M21.51,4.34a1.09,1.09,0,1,1-1.08-1.08,1.08,1.08,0,0,1,1.08,1.08"></path>
      <path fill="#6f73d5" d="M5.14,15.79a.54.54,0,0,0-.55-.55H3.92v5H5.14Z"></path>
      <path fill="#6f73d5" d="M10.76,11.36a.55.55,0,0,0-.55-.55H9.54v9.43h1.22Z"></path>
      <path fill="#6f73d5" d="M16.38,9.15a.55.55,0,0,0-.16-.39.51.51,0,0,0-.39-.16h-.67V20.24h1.22Z"></path>
      <path fill="#6f73d5" d="M22,6.93a.55.55,0,0,0-.55-.55h-.67V20.24H22Z"></path>
      <path fill="#6f73d5" d="M2,20.74H22a.5.5,0,0,0,.5-.5.5.5,0,0,0-.5-.5H2a.5.5,0,0,0-.5.5A.5.5,0,0,0,2,20.74Z"></path>
    </g>
  </svg>
);
