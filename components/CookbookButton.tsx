import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DownloadIcon from './icons/DownloadIcon';

interface CookbookButtonProps {
    elementIdToPrint: string;
    ingredients: string[];
}

const CookbookButton: React.FC<CookbookButtonProps> = ({ elementIdToPrint, ingredients }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCreateCookbook = async () => {
        const element = document.getElementById(elementIdToPrint);
        if (!element) {
            console.error("Element to print not found!");
            return;
        }

        setIsGenerating(true);

        try {
            // Temporarily modify styles for better PDF output
            element.style.transform = 'none';
            const cards = element.querySelectorAll<HTMLElement>('.transform');
            cards.forEach(card => {
                card.style.transform = 'none';
                card.style.boxShadow = 'none';
            });
            
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true, 
                backgroundColor: null, // Use transparent background
                windowWidth: element.scrollWidth,
                windowHeight: element.scrollHeight,
            });

            // Restore original styles
            element.style.transform = '';
            cards.forEach(card => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });

            const imgData = canvas.toDataURL('image/png');
            
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;

            // --- Add Title Page ---
            pdf.setFontSize(36);
            pdf.setFont('helvetica', 'bold');
            pdf.text("RecipeGenius Cookbook", pdfWidth / 2, 100, { align: 'center' });

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'normal');
            pdf.text("A collection of recipes based on your ingredients:", pdfWidth / 2, 150, { align: 'center' });
            
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'italic');
            const ingredientText = ingredients.join(', ');
            const splitIngredients = pdf.splitTextToSize(ingredientText, pdfWidth - (margin * 2));
            pdf.text(splitIngredients, pdfWidth / 2, 180, { align: 'center' });
            
            pdf.addPage();
            
            // --- Add Recipes ---
            const imgProps = pdf.getImageProperties(imgData);
            const contentWidth = pdfWidth - (margin * 2);
            const contentHeight = (imgProps.height * contentWidth) / imgProps.width;
            
            let heightLeft = contentHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, contentHeight);
            heightLeft -= (pdfHeight - (margin * 2));

            while (heightLeft > 0) {
                position = heightLeft - contentHeight - margin;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', margin, position + margin, contentWidth, contentHeight);
                heightLeft -= (pdfHeight - (margin * 2));
            }

            pdf.save('RecipeGenius_Cookbook.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            // You could add a user-facing error message here
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleCreateCookbook}
            disabled={isGenerating}
            className="px-4 py-2 bg-white border border-primary text-primary font-semibold rounded-lg shadow-sm hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-gray-200 disabled:cursor-wait disabled:text-gray-500 transition-all duration-200 ease-in-out flex items-center gap-2"
        >
            {isGenerating ? (
                <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                    <span>Creating...</span>
                </>
            ) : (
                <>
                    <DownloadIcon className="h-5 w-5" />
                    <span>Create Cookbook</span>
                </>
            )}
        </button>
    );
};

export default CookbookButton;