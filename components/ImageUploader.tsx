import React, { useCallback, useRef } from 'react';
import { UploadIcon, TrashIcon, LoadingIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  onClearImage: () => void;
  imagePreviewUrl: string | null;
  isVerifying?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, onClearImage, imagePreviewUrl, isVerifying = false }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
    // Reset input value to allow re-uploading the same file if needed (e.g. after error)
    if (event.target) event.target.value = '';
  };
  
  const handleDragOver = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    if (isVerifying) return; // Prevent drop while verifying
    const file = event.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload, isVerifying]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center w-full aspect-video border-2 border-cyan-300 rounded-xl bg-cyan-50 animate-pulse">
        <LoadingIcon />
        <p className="mt-4 text-xl font-bold text-cyan-800">Verifying Timeframe...</p>
        <p className="text-sm text-cyan-600 font-medium">Analyzing chart metadata</p>
      </div>
    );
  }

  if (imagePreviewUrl) {
    return (
      <div className="relative w-full aspect-video rounded-lg overflow-hidden group border-2 border-gray-200 shadow-sm">
        <img src={imagePreviewUrl} alt="Chart preview" className="w-full h-full object-contain bg-gray-100" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onClearImage}
            className="flex items-center gap-2 px-6 py-3 bg-white text-red-600 font-bold text-base rounded-xl hover:bg-red-50 transition-colors shadow-lg"
          >
            <TrashIcon />
            Remove Image
          </button>
        </div>
      </div>
    );
  }

  return (
    <label 
        className="flex flex-col items-center justify-center w-full aspect-video border-2 border-gray-300 rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
        <UploadIcon />
        <p className="mb-3 text-lg text-gray-600"><span className="font-bold text-cyan-600">Click to upload</span> or drag and drop</p>
        <p className="text-sm text-gray-500">PNG, JPG, GIF or WEBP</p>
      </div>
      <input ref={inputRef} id="dropzone-file" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
    </label>
  );
};