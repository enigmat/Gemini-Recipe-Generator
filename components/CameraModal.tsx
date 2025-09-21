import React, { useState, useRef, useEffect, useCallback } from 'react';
import { identifyIngredientsFromImage } from '../services/geminiService';
import XIcon from './icons/XIcon';
import CameraIcon from './icons/CameraIcon';

interface CameraModalProps {
    onClose: () => void;
    onIngredientsScanned: (ingredients: string[]) => void;
}

type ModalState = 'requesting' | 'streaming' | 'captured' | 'loading' | 'error';

const CameraModal: React.FC<CameraModalProps> = ({ onClose, onIngredientsScanned }) => {
    const [modalState, setModalState] = useState<ModalState>('requesting');
    const [error, setError] = useState<string | null>(null);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const cleanupCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        const startCamera = async () => {
            try {
                if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setModalState('streaming');
                    }
                } else {
                    throw new Error("Camera access is not supported by this browser.");
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                if (err instanceof Error) {
                     if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                        setError("Camera permission was denied. Please enable it in your browser settings.");
                    } else {
                        setError(err.message);
                    }
                } else {
                     setError("An unknown error occurred while trying to access the camera.");
                }
                setModalState('error');
            }
        };

        startCamera();

        return () => {
            cleanupCamera();
        };
    }, [cleanupCamera]);

    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                setCapturedImage(imageDataUrl);
                setModalState('captured');
                cleanupCamera();
            }
        }
    };

    const handleRetake = () => {
        setCapturedImage(null);
        setModalState('requesting'); // Will trigger useEffect to restart camera
    };

    const handleAnalyze = async () => {
        if (!capturedImage) return;
        
        setModalState('loading');
        setError(null);
        
        try {
            // Remove the data URL prefix
            const base64Data = capturedImage.split(',')[1];
            const ingredients = await identifyIngredientsFromImage(base64Data);
            if (ingredients.length === 0) {
                 setError("No ingredients were identified. Please try again with a clearer picture.");
                 setModalState('captured');
            } else {
                onIngredientsScanned(ingredients);
            }
        } catch (err) {
             if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("An unknown error occurred during analysis.");
            }
            setModalState('captured'); // Go back to captured state on error
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden relative">
                <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 z-10" aria-label="Close camera modal">
                    <XIcon className="h-6 w-6" />
                </button>

                <div className="p-6">
                    <h2 className="text-2xl font-bold text-center text-text-primary mb-4">Scan Ingredients</h2>
                    
                    <div className="aspect-video bg-gray-900 rounded overflow-hidden relative flex items-center justify-center">
                        {modalState === 'streaming' && <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>}
                        {capturedImage && <img src={capturedImage} alt="Captured ingredients" className="w-full h-full object-cover" />}
                        {(modalState === 'requesting' || modalState === 'loading') && (
                             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        )}
                        {modalState === 'error' && (
                             <div className="text-red-400 text-center p-4">
                                <p className="font-semibold">Error</p>
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                    </div>

                     {error && modalState !== 'error' && (
                        <div className="mt-4 text-center bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg text-sm" role="alert">
                           {error}
                        </div>
                    )}

                    <div className="mt-6 flex justify-center gap-4">
                        {modalState === 'streaming' && (
                            <button onClick={handleCapture} className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus flex items-center gap-2">
                                <CameraIcon className="w-6 h-6" />
                                <span>Capture</span>
                            </button>
                        )}
                        {modalState === 'captured' && (
                            <>
                                <button onClick={handleRetake} className="px-6 py-3 bg-gray-200 text-text-primary font-semibold rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400">
                                    Retake
                                </button>
                                <button onClick={handleAnalyze} className="px-6 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus">
                                    Use Photo
                                </button>
                            </>
                        )}
                         {modalState === 'loading' && (
                            <p className="text-text-secondary">Analyzing image...</p>
                        )}
                    </div>
                </div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
        </div>
    );
};

export default CameraModal;