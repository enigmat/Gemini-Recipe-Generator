import React, { useState, useRef, useEffect } from 'react';
import XIcon from './icons/XIcon';
import CameraIcon from './icons/CameraIcon';
import ArrowPathIcon from './icons/ArrowPathIcon';
import Spinner from './Spinner';

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const startCamera = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
          setStream(mediaStream);
        } catch (err) {
          console.error('Error accessing camera:', err);
          setError('Could not access the camera. Please check permissions and try again.');
        } finally {
          setIsLoading(false);
        }
      };
      startCamera();
    } else {
      // Cleanup when modal is closed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      setImagePreview(null);
      setError(null);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen]);

  const handleSnap = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        setImagePreview(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  const handleRetake = () => {
    setImagePreview(null);
  };
  
  const handleUsePhoto = () => {
    if (imagePreview) {
      onCapture(imagePreview);
    }
  };

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setStream(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 animate-fade-in" onClick={handleClose}>
      <div className="bg-slate-800 rounded-lg shadow-xl w-11/12 max-w-2xl p-4 relative" onClick={e => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-2 right-2 text-white/70 hover:text-white z-20" aria-label="Close camera">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="aspect-video bg-black rounded-md overflow-hidden relative">
          {error && (
            <div className="w-full h-full flex flex-col items-center justify-center text-red-400">
              <p>{error}</p>
            </div>
          )}
          {isLoading && !error && (
             <div className="w-full h-full flex flex-col items-center justify-center text-white/80 gap-2">
                <Spinner size="w-8 h-8"/>
                <p>Starting camera...</p>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className={`w-full h-full object-cover ${imagePreview ? 'hidden' : 'block'}`}
            onCanPlay={() => setIsLoading(false)}
          />
          {imagePreview && (
            <img src={imagePreview} alt="Captured preview" className="w-full h-full object-cover" />
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="mt-4 flex justify-center items-center h-16">
          {imagePreview ? (
            <div className="flex gap-4">
              <button
                onClick={handleRetake}
                className="flex items-center gap-2 px-6 py-3 bg-slate-600 text-white font-bold rounded-full shadow-lg hover:bg-slate-500 transition-transform hover:scale-105"
              >
                <ArrowPathIcon className="w-5 h-5" />
                <span>Retake</span>
              </button>
              <button
                onClick={handleUsePhoto}
                className="px-8 py-3 bg-teal-500 text-white font-bold rounded-full shadow-lg hover:bg-teal-600 transition-transform hover:scale-105"
              >
                Use this Photo
              </button>
            </div>
          ) : (
            <button
              onClick={handleSnap}
              disabled={isLoading || !!error}
              className="w-16 h-16 rounded-full bg-white border-4 border-slate-400 disabled:opacity-50"
              aria-label="Snap photo"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
