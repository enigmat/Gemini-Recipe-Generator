import React, { useState, useMemo } from 'react';
import { Recipe } from '../types';
import * as globalRecipeService from '../services/globalRecipeService';
import { generateRecipeExportHtml, downloadFile } from '../utils/exportUtils';
import SearchBar from './SearchBar';
import DownloadIcon from './icons/DownloadIcon';

const masterRecipes = globalRecipeService.getMasterRecipeList();

const AdminMonthlyDrop: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRecipes = useMemo(() => {
        if (!searchQuery) return masterRecipes.sort((a,b) => a.title.localeCompare(b.title));
        return masterRecipes.filter(r => r.title.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a,b) => a.title.localeCompare(b.title));
    }, [searchQuery]);

    const handleToggle = (recipeId: number) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(recipeId)) {
                newSet.delete(recipeId);
            } else {
                newSet.add(recipeId);
            }
            return newSet;
        });
    };

    const handleSelectAll = () => {
        if (selectedIds.size === filteredRecipes.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(filteredRecipes.map(r => r.id)));
        }
    };

    const handleGenerate = () => {
        const selectedRecipes = masterRecipes.filter(r => selectedIds.has(r.id));
        if (selectedRecipes.length === 0) {
            alert("Please select at least one recipe to export.");
            return;
        }
        const htmlContent = generateRecipeExportHtml(selectedRecipes);
        downloadFile(htmlContent, 'monthly_recipes.html', 'text/html');
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Monthly Recipe Drop</h2>
            <p className="text-slate-600 mb-6">
                Select recipes from the master catalog to include in the monthly email for premium subscribers. This tool will generate an HTML file compatible with the Bulk Import feature.
            </p>

            <div className="mb-4">
                <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search master recipe list..." />
            </div>

            <div className="max-h-96 overflow-y-auto border rounded-md p-2 space-y-1 mb-4">
                <label className="flex items-center p-2 hover:bg-slate-50 rounded-md cursor-pointer font-semibold">
                    <input
                        type="checkbox"
                        checked={selectedIds.size > 0 && selectedIds.size === filteredRecipes.length}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                    />
                    <span className="ml-3 text-sm text-slate-800">Select All ({selectedIds.size} / {filteredRecipes.length})</span>
                </label>
                {filteredRecipes.map(recipe => (
                    <label key={recipe.id} className="flex items-center p-2 hover:bg-slate-50 rounded-md cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedIds.has(recipe.id)}
                            onChange={() => handleToggle(recipe.id)}
                            className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="ml-3 text-sm text-slate-800">{recipe.title}</span>
                    </label>
                ))}
            </div>

            <button
                onClick={handleGenerate}
                disabled={selectedIds.size === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300"
            >
                <DownloadIcon className="w-5 h-5" />
                Generate HTML for Email ({selectedIds.size} selected)
            </button>
        </div>
    );
};

export default AdminMonthlyDrop;
