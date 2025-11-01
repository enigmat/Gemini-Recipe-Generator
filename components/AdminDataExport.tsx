import React, { useState } from 'react';
import { Recipe } from '../types';
import DownloadIcon from './icons/DownloadIcon';
import Spinner from './Spinner';

interface AdminDataExportProps {
    allRecipes: Recipe[];
}

const AdminDataExport: React.FC<AdminDataExportProps> = ({ allRecipes }) => {
    const [isExporting, setIsExporting] = useState(false);

    const escapeCsvField = (field: any): string => {
        if (field == null) { // Catches null and undefined
          return '""';
        }
        const stringField = String(field);
        // Replace any double quotes with two double quotes
        const escapedField = stringField.replace(/"/g, '""');
        // Wrap the entire field in double quotes
        return `"${escapedField}"`;
    };

    const handleExport = () => {
        setIsExporting(true);

        const recipesToExport = allRecipes;
        const chunkSize = 250;
        
        const headers = [
            'id', 'title', 'image', 'description', 'cookTime', 'servings', 'calories', 'cuisine',
            'tags', 'ingredients', 'instructions', 'winePairing', 'rating'
        ];

        const csvHeader = headers.map(escapeCsvField).join(',') + '\n';

        for (let i = 0; i < recipesToExport.length; i += chunkSize) {
            const chunk = recipesToExport.slice(i, i + chunkSize);
            
            const csvRows = chunk.map(recipe => {
                const rowData = [
                    recipe.id,
                    recipe.title,
                    recipe.image,
                    recipe.description,
                    recipe.cookTime,
                    recipe.servings,
                    recipe.calories || '',
                    recipe.cuisine,
                    (recipe.tags || []).join(', '),
                    JSON.stringify(recipe.ingredients),
                    (recipe.instructions || []).join('\n'),
                    JSON.stringify(recipe.winePairing || {}),
                    JSON.stringify(recipe.rating || {}),
                ];
                return rowData.map(escapeCsvField).join(',');
            });
            
            const csvContent = csvHeader + csvRows.join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            const partNumber = Math.floor(i / chunkSize) + 1;
            const totalParts = Math.ceil(recipesToExport.length / chunkSize);
            link.setAttribute('download', `recipes_export_part_${partNumber}_of_${totalParts}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }

        setTimeout(() => setIsExporting(false), 500); // Give browser time to initiate download
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">Export Recipe Data</h2>
            <p className="text-slate-600 mb-6">
                Click the button below to download all recipes from the database as CSV files. If there are more than 250 recipes, the data will be split into multiple files.
            </p>

            <div className="text-center">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition-colors disabled:bg-green-300 disabled:cursor-wait"
                >
                    {isExporting ? <Spinner /> : <DownloadIcon className="w-5 h-5" />}
                    <span>{isExporting ? 'Exporting...' : `Export ${allRecipes.length} Recipes to CSV`}</span>
                </button>
            </div>
        </div>
    );
};

export default AdminDataExport;
