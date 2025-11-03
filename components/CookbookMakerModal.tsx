import React, { useState } from 'react';
import { Recipe, UserCookbook } from '../types';
import * as geminiService from '../services/geminiService';
import XIcon from './icons/XIcon';
import Spinner from './Spinner';
import StoredImage from './StoredImage';
import { formatIngredient, formatInstruction } from '../utils/recipeUtils';
import PrintIcon from './icons/PrintIcon';
import SparklesIcon from './icons/SparklesIcon';

interface CookbookMakerModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteRecipes: Recipe[];
  measurementSystem: 'metric' | 'us';
}

const CookbookMakerModal: React.FC<CookbookMakerModalProps> = ({ isOpen, onClose, favoriteRecipes, measurementSystem }) => {
  const [step, setStep] = useState(1); // 1: Select, 2: Loading, 3: View
  const [selectedRecipeIds, setSelectedRecipeIds] = useState<number[]>([]);
  const [cookbookTitle, setCookbookTitle] = useState('');
  const [generatedCookbook, setGeneratedCookbook] = useState<UserCookbook | null>(null);
  const [error, setError] = useState('');

  const handleToggleRecipe = (id: number) => {
    setSelectedRecipeIds(prev => prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]);
  };

  const handleGenerate = async () => {
    if (!cookbookTitle.trim() || selectedRecipeIds.length === 0) {
      setError('Please provide a title and select at least one recipe.');
      return;
    }
    setError('');
    setStep(2);

    const selectedRecipes = favoriteRecipes
        .filter(r => selectedRecipeIds.includes(r.id))
        .sort((a, b) => a.title.localeCompare(b.title));
    const recipeTitles = selectedRecipes.map(r => r.title);

    try {
      const introduction = await geminiService.generateCookbookIntroduction(cookbookTitle, recipeTitles);
      setGeneratedCookbook({
        title: cookbookTitle,
        introduction,
        recipes: selectedRecipes,
      });
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Failed to generate cookbook.");
      setStep(1);
    }
  };
  
  const handlePrint = () => {
    const printContents = document.getElementById('printable-cookbook-content')?.innerHTML;
    const originalContents = document.body.innerHTML;
    if (printContents) {
        document.body.innerHTML = `
            <html>
                <head>
                    <title>${generatedCookbook?.title || 'Cookbook'}</title>
                    <style>
                        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
                        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
                        @page { size: auto; margin: 20mm; }
                        h1, h2, h3, h4 { page-break-after: avoid; }
                        .cookbook-page { page-break-before: always; }
                        .cookbook-cover { page-break-before: auto; }
                        img { max-width: 100%; height: auto; border-radius: 8px; }
                        ul, ol { padding-left: 20px; }
                    </style>
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
        `;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore event listeners and React state
    }
  };
  
  const resetAndClose = () => {
    setStep(1);
    setSelectedRecipeIds([]);
    setCookbookTitle('');
    setGeneratedCookbook(null);
    setError('');
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 animate-fade-in"
      onClick={resetAndClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-11/12 max-w-4xl max-h-[90vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800">
            {step === 3 ? generatedCookbook?.title : 'Create Your Own Cookbook'}
          </h2>
           <div className="flex items-center gap-2">
            {step === 3 && (
                 <button onClick={handlePrint} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Print Cookbook">
                    <PrintIcon className="w-5 h-5 text-slate-600" />
                 </button>
            )}
            <button onClick={resetAndClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors" aria-label="Close">
                <XIcon className="w-6 h-6 text-slate-600" />
            </button>
          </div>
        </header>

        <main className="flex-grow overflow-y-auto p-6">
            {step === 1 && (
                <div className="animate-fade-in">
                    <div className="mb-6">
                        <label htmlFor="cookbook-title" className="block text-sm font-medium text-slate-700 mb-1">Cookbook Title</label>
                        <input
                            type="text"
                            id="cookbook-title"
                            value={cookbookTitle}
                            onChange={(e) => setCookbookTitle(e.target.value)}
                            placeholder="e.g., My Favorite Weeknight Meals"
                            className="w-full p-2 border border-slate-300 rounded-lg"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Select Recipes</label>
                        <div className="max-h-64 overflow-y-auto border rounded-lg p-2 space-y-1">
                            {favoriteRecipes.map(recipe => (
                                <label key={recipe.id} className="flex items-center p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedRecipeIds.includes(recipe.id)}
                                        onChange={() => handleToggleRecipe(recipe.id)}
                                        className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                                    />
                                    <span className="ml-3 text-sm text-slate-800">{recipe.title}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                    <button onClick={handleGenerate} disabled={!cookbookTitle.trim() || selectedRecipeIds.length === 0} className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 disabled:bg-teal-300">
                        <SparklesIcon className="w-5 h-5" />
                        Generate Cookbook
                    </button>
                </div>
            )}
            {step === 2 && (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-slate-600">
                    <Spinner size="w-10 h-10" />
                    <p className="font-semibold">Our AI chef is writing your cookbook...</p>
                </div>
            )}
            {step === 3 && generatedCookbook && (
                <div id="printable-cookbook-content" className="animate-fade-in">
                    <div className="text-center p-8 cookbook-cover">
                        <h1 className="text-4xl font-bold text-slate-800">{generatedCookbook.title}</h1>
                        <p className="mt-6 text-slate-600 whitespace-pre-wrap max-w-2xl mx-auto">{generatedCookbook.introduction}</p>
                    </div>
                    {generatedCookbook.recipes.map(recipe => (
                        <div key={recipe.id} className="py-8 border-t cookbook-page">
                           <h2 className="text-2xl font-bold mb-4 text-slate-800">{recipe.title}</h2>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <StoredImage src={recipe.image} alt={recipe.title} className="w-full h-64 object-cover rounded-lg mb-4" />
                                    <p className="text-sm text-slate-600">{recipe.description}</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2 text-slate-700">Ingredients</h3>
                                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-600 mb-4">
                                        {recipe.ingredients.map((ing, i) => <li key={i}>{formatIngredient(ing, measurementSystem)}</li>)}
                                    </ul>
                                    <h3 className="font-semibold text-lg mb-2 text-slate-700">Instructions</h3>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                                        {recipe.instructions.map((inst, i) => <li key={i}>{formatInstruction(inst, measurementSystem)}</li>)}
                                    </ol>
                                </div>
                           </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
      </div>
    </div>
  );
};

export default CookbookMakerModal;
