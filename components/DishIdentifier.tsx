import React, { useState } from 'react';
import { DishInfo } from '../types';
import * as geminiService from '../services/geminiService';
import ImageUploader from './ImageUploader';
import Spinner from './Spinner';
import SparklesIcon from './icons/SparklesIcon';
import GlobeAltIcon from './icons/GlobeAltIcon';
import SearchIcon from './icons/SearchIcon';

interface DishIdentifierProps {
  onSearchForDish: (dishName: string) => void;
}

const DishIdentifier: React.FC<DishIdentifierProps> = ({ onSearchForDish }) => {
  const [imageData, setImageData] = useState<{ base64: string; mimeType: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DishInfo | null>(null);
  const [imagePreviewForDisplay, setImagePreviewForDisplay] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!imageData) return;
    
    setIsLoading(true);
    setError(null);
    setResult(null);

    // Keep a copy of the preview URL because the uploader might clear it
    const reader = new FileReader();
    const blob = await (await fetch(`data:${imageData.mimeType};base64,${imageData.base64}`)).blob();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
        setImagePreviewForDisplay(reader.result as string);
    };

    try {
      const analysisResult = await geminiService.identifyDishFromImage(imageData.base64, imageData.mimeType);
      setResult(analysisResult);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setImageData(null);
    setResult(null);
    setError(null);
    setImagePreviewForDisplay(null);
  };
  
  const handleSearchClick = () => {
    if (result) {
        onSearchForDish(result.dishName);
    }
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
        {result ? (
             <div className="bg-white rounded-2xl shadow-xl p-8 animate-fade-in space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <img src={imagePreviewForDisplay || ''} alt="Analyzed dish" className="w-full h-64 object-cover rounded-lg"/>
                    <div className="text-center md:text-left">
                        <p className="font-semibold text-teal-600">Identified as</p>
                        <h2 className="text-4xl font-bold text-slate-800">{result.dishName}</h2>
                        <p className="mt-2 font-medium text-slate-500">Origin: {result.origin}</p>
                    </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
                    <p className="text-slate-700">{result.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                     <button
                        onClick={handleSearchClick}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                    >
                        <SearchIcon className="w-5 h-5" />
                        Find Recipes for {result.dishName}
                    </button>
                    <button
                        onClick={handleReset}
                        className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 font-bold rounded-lg border-2 border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                        Analyze Another
                    </button>
                </div>
             </div>
        ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <GlobeAltIcon className="w-12 h-12 text-teal-500 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-800 mt-4">Where's This Dish From?</h2>
                <p className="text-gray-600 mt-2 mb-8 max-w-lg mx-auto">
                    Upload a photo of any dish, and our AI will tell you its name, origin, and a fun fact about it.
                </p>
                <div className="text-left">
                    <ImageUploader onImageReady={(base64, mimeType) => setImageData({ base64, mimeType })} />
                </div>
                 <button 
                    onClick={handleAnalyze} 
                    disabled={isLoading || !imageData}
                    className="w-full mt-6 flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300 disabled:cursor-wait"
                >
                    {isLoading ? <Spinner size="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                    <span>{isLoading ? 'Analyzing Image...' : 'Identify Dish'}</span>
                </button>
                {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
            </div>
        )}
    </div>
  );
};

export default DishIdentifier;