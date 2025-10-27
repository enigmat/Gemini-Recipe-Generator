import React from 'react';
import { ProductAnalysis } from '../types';
import XIcon from './icons/XIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface ProductAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ProductAnalysis;
  productName: string;
}

const ProductAnalysisModal: React.FC<ProductAnalysisModalProps> = ({ isOpen, onClose, analysis, productName }) => {
  if (!isOpen) return null;

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'bg-green-500';
    if (score >= 5) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const scoreColor = getScoreColor(analysis.score);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 md:max-w-xl max-h-[90vh] flex flex-col p-6 md:p-8 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 z-10 transition-colors" aria-label="Close modal">
          <XIcon className="w-6 h-6" />
        </button>

        <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 capitalize">{productName}</h2>
            <p className="text-gray-600 mt-1">AI Health Analysis</p>
        </div>

        <div className="my-6 flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-white text-4xl font-bold ${scoreColor}`}>
                {analysis.score}<span className="text-xl font-medium">/10</span>
            </div>
        </div>
        
        <div className="flex-grow overflow-y-auto pr-2 space-y-6">
            <div>
                <h3 className="font-semibold text-gray-800 mb-2">Summary</h3>
                <p className="text-sm text-gray-600 p-4 bg-gray-50 rounded-lg border">{analysis.summary}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Pros</h3>
                    <ul className="space-y-2">
                        {analysis.pros.map((pro, index) => (
                            <li key={index} className="flex items-start">
                                <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{pro}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Cons</h3>
                    <ul className="space-y-2">
                        {analysis.cons.map((con, index) => (
                            <li key={index} className="flex items-start">
                                <XCircleIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{con}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {analysis.additives && analysis.additives.length > 0 && (
                 <div>
                    <h3 className="font-semibold text-gray-800 mb-2">Additives to Note</h3>
                    <div className="flex flex-wrap gap-2">
                        {analysis.additives.map((additive, index) => (
                            <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                {additive}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>

        <div className="mt-6 text-center">
            <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-2.5 bg-gray-800 text-white font-bold rounded-lg shadow-md hover:bg-gray-900 transition-colors text-base"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalysisModal;
