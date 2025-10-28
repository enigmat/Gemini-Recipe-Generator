import React, { useState } from 'react';
import { ProductAnalysis } from '../types';
import { analyzeProduct } from '../services/geminiService';
import Spinner from './Spinner';
import BarcodeIcon from './icons/BarcodeIcon';
import ProductAnalysisModal from './ProductAnalysisModal';

const ProductAnalyzer: React.FC = () => {
    const [productQuery, setProductQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setAnalysis(null);

        try {
            const result = await analyzeProduct(productQuery);
            setAnalysis(result);
            setIsModalOpen(true);
        } catch (err: any) {
            setError(err.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleScan = () => {
        alert("Barcode scanning is not yet implemented.");
    }

    return (
        <>
            <div className="bg-white p-8 rounded-lg shadow-sm border">
                <h2 className="text-2xl font-bold text-gray-800 text-center">Product Analyzer</h2>
                <p className="text-gray-600 mt-2 text-center max-w-lg mx-auto">
                    Curious about a product? Enter its name below to get an instant AI-powered health analysis, similar to Yuka.
                </p>
                <form onSubmit={handleAnalyze} className="mt-6 max-w-xl mx-auto flex gap-2">
                    <input
                        type="text"
                        value={productQuery}
                        onChange={(e) => setProductQuery(e.target.value)}
                        placeholder="e.g., Cheerios, Nutella, instant ramen..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow text-base"
                        aria-label="Product name"
                        disabled={isLoading}
                    />
                     <button
                        type="button"
                        onClick={handleScan}
                        className="p-3 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors flex items-center justify-center aspect-square"
                        aria-label="Scan product barcode"
                        title="Scan product barcode (coming soon)"
                    >
                        <BarcodeIcon className="w-6 h-6" />
                    </button>
                    <button
                        type="submit"
                        className="px-6 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors flex items-center justify-center disabled:bg-teal-300 disabled:cursor-wait"
                        disabled={!productQuery.trim() || isLoading}
                        aria-label="Analyze product"
                    >
                        {isLoading ? <Spinner /> : 'Analyze'}
                    </button>
                </form>
                <div className="h-5">
                    {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
                </div>
            </div>
            {analysis && (
                <ProductAnalysisModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    analysis={analysis}
                    productName={productQuery}
                />
            )}
        </>
    );
};

export default ProductAnalyzer;