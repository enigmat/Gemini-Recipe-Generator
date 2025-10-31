import React, { useState, useEffect } from 'react';
import { Recipe, Ingredient } from '../types';
import XIcon from './icons/XIcon';

interface AdminEditRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
}

const AdminEditRecipeModal: React.FC<AdminEditRecipeModalProps> = ({ isOpen, onClose, recipe, onSave }) => {
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'image' | 'rating'>>({
    title: '',
    description: '',
    cookTime: '',
    servings: '',
    calories: '',
    ingredients: [],
    instructions: [],
    tags: [],
    winePairing: { suggestion: '', description: '' }
  });
  const [ingredientsJson, setIngredientsJson] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);

  useEffect(() => {
    if (recipe) {
      setFormData({
        title: recipe.title,
        description: recipe.description,
        cookTime: recipe.cookTime,
        servings: recipe.servings,
        calories: recipe.calories || '',
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        tags: recipe.tags || [],
        winePairing: recipe.winePairing
      });
      setIngredientsJson(JSON.stringify(recipe.ingredients, null, 2));
      setJsonError(null);
    }
  }, [recipe]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }));
  };

  const handleInstructionsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, instructions: e.target.value.split('\n') }));
  };
  
  const handleIngredientsJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIngredientsJson(e.target.value);
    try {
        const parsed = JSON.parse(e.target.value);
        if (Array.isArray(parsed) && parsed.every(item => 'name' in item && 'metric' in item && 'us' in item)) {
            setFormData(prev => ({...prev, ingredients: parsed as Ingredient[]}));
            setJsonError(null);
        } else {
            setJsonError('Invalid ingredients structure. Each item needs name, metric, and us properties.');
        }
    } catch (error) {
        setJsonError('Invalid JSON format.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jsonError) {
        alert("Cannot save: Ingredients JSON is invalid.");
        return;
    }
    onSave({ ...recipe, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-3xl m-4 max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
            <h2 className="text-2xl font-bold text-slate-800">Edit Recipe</h2>
            <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                <XIcon className="w-6 h-6" />
            </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto pr-4 -mr-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <input name="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700">Tags (comma-separated)</label>
              <input name="tags" value={formData.tags?.join(', ') || ''} onChange={handleTagsChange} className="mt-1 block w-full input-style" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full input-style" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700">Cook Time</label>
              <input name="cookTime" value={formData.cookTime} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Servings</label>
              <input name="servings" value={formData.servings} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Calories</label>
              <input name="calories" value={formData.calories} onChange={handleChange} className="mt-1 block w-full input-style" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Instructions (one per line)</label>
            <textarea name="instructions" value={formData.instructions.join('\n')} onChange={handleInstructionsChange} rows={6} className="mt-1 block w-full input-style" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Ingredients (JSON format)</label>
            <textarea value={ingredientsJson} onChange={handleIngredientsJsonChange} rows={10} className={`mt-1 block w-full font-mono text-xs input-style ${jsonError ? 'border-red-500 ring-red-500' : ''}`} />
            {jsonError && <p className="text-red-500 text-xs mt-1">{jsonError}</p>}
          </div>

        </form>
        <div className="flex items-center justify-end gap-3 pt-4 border-t mt-auto flex-shrink-0">
            <button type="button" onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-800 font-bold py-2 px-4 rounded-lg border border-slate-300">
                Cancel
            </button>
            <button type="submit" onClick={handleSubmit} form="edit-recipe-form" className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-lg">
              Save Changes
            </button>
        </div>
      </div>
      <style>{`.input-style { border: 1px solid #cbd5e1; border-radius: 0.375rem; padding: 0.5rem 0.75rem; width: 100%; box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); } .input-style:focus { outline: 2px solid transparent; outline-offset: 2px; --tw-ring-color: #14b8a6; border-color: #14b8a6; }`}</style>
    </div>
  );
};

export default AdminEditRecipeModal;
