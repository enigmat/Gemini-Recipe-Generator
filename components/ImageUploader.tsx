import React, { useState, useRef, useCallback } from 'react';
import ImageIcon from './icons/ImageIcon';
import XIcon from './icons/XIcon';
import Spinner from './Spinner';
import CameraIcon from './icons/CameraIcon';
import CameraModal from './CameraModal';

interface ImageUploaderProps {
  onImageReady: (base64: string, mimeType: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageReady }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);

  const processFile = (file: File) => {
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please upload a JPG, PNG, WEBP, or GIF.');
      return;
    }
    
    setIsLoading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImagePreview(reader.result as string);
      onImageReady(base64String, file.type);
      setIsLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
    onImageReady('', ''); // Signal removal
  };
  
  const onDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const onPaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) processFile(file);
          break;
        }
      }
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('paste', onPaste);
    return () => {
        window.removeEventListener('paste', onPaste);
    }
  }, [onPaste]);

  const handleCapture = (dataUrl: string) => {
    if (dataUrl) {
      const mimeType = dataUrl.substring(dataUrl.indexOf(':') + 1, dataUrl.indexOf(';'));
      const base64String = dataUrl.split(',')[1];
      setImagePreview(dataUrl);
      onImageReady(base64String, mimeType);
    }
    setIsCameraModalOpen(false);
  };

  if (imagePreview) {
    return (
      <div className="relative group">
        <img src={imagePreview} alt="Dish preview" className="w-full h-48 object-cover rounded-lg border" />
        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove image"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        onDragEnter={onDragEnter}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-teal-500 bg-teal-50' : 'border-gray-300 bg-gray-50'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/jpeg,image/png,image/webp,image/gif"
        />
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
              <Spinner />
              <span>Processing...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 text-gray-500">
            <ImageIcon className="w-10 h-10" />
            <p className="font-semibold">
              <button onClick={() => fileInputRef.current?.click()} className="text-teal-600 hover:underline focus:outline-none">
                Click to upload
              </button>
              , drag & drop, or paste.
            </p>
            <div className="flex items-center gap-2">
                  <div className="h-px bg-gray-300 flex-grow w-16"></div>
                  <span className="text-xs font-semibold">OR</span>
                  <div className="h-px bg-gray-300 flex-grow w-16"></div>
              </div>
              <button
                  type="button"
                  onClick={() => setIsCameraModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-400 rounded-lg shadow-sm text-gray-700 font-semibold hover:bg-gray-100"
              >
                  <CameraIcon className="w-5 h-5" />
                  <span>Use Camera</span>
              </button>
          </div>
        )}
      </div>
      <CameraModal 
        isOpen={isCameraModalOpen}
        onClose={() => setIsCameraModalOpen(false)}
        onCapture={handleCapture}
      />
    </>
  );
};

export default ImageUploader;
