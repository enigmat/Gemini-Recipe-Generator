import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import DownloadIcon from './icons/DownloadIcon';

interface CookbookButtonProps {
    elementIdToPrint: string;
    ingredients?: string[];
}

const CookbookButton: React.FC<CookbookButtonProps> = ({ elementIdToPrint, ingredients }) => {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleCreateCookbook = async () => {
        const container = document.getElementById(elementIdToPrint);
        if (!container) {
            console.error("Element to print not found!");
            return;
        }

        const cards = container.querySelectorAll<HTMLElement>('.printable-recipe-card');
        if (cards.length === 0) {
            alert("No recipes to include in the cookbook.");
            return;
        }

        setIsGenerating(true);

        try {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const margin = 40;
            const contentWidth = pdfWidth - (margin * 2);

            // --- Add Title Page ---
            pdf.setFontSize(36);
            pdf.setFont('helvetica', 'bold');
            pdf.text("Recipe Extracter Cookbook", pdfWidth / 2, 100, { align: 'center' });

            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'normal');
            
            if (ingredients && ingredients.length > 0) {
                pdf.text("A collection of recipes based on your ingredients:", pdfWidth / 2, 150, { align: 'center' });
                pdf.setFontSize(12);
                pdf.setFont('helvetica', 'italic');
                const ingredientText = ingredients.join(', ');
                const splitIngredients = pdf.splitTextToSize(ingredientText, contentWidth);
                pdf.text(splitIngredients, pdfWidth / 2, 180, { align: 'center' });
            } else {
                 pdf.text("A personal collection of your favorite recipes.", pdfWidth / 2, 150, { align: 'center' });
            }
            
            pdf.addPage();
            
            // --- Add Recipes ---
            const pageHeight = pdf.internal.pageSize.getHeight();
            let yPos = margin;
            const cardSpacing = 20;

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                
                const canvas = await html2canvas(card, {
                    scale: 2,
                    useCORS: true, 
                    backgroundColor: '#ffffff',
                });

                const imgData = canvas.toDataURL('image/png');
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * contentWidth) / imgProps.width;

                if (yPos + imgHeight > pageHeight - margin) {
                    pdf.addPage();
                    yPos = margin;
                }

                pdf.addImage(imgData, 'PNG', margin, yPos, contentWidth, imgHeight);
                yPos += imgHeight + cardSpacing;
            }


            pdf.save('Recipe_Extracter_Cookbook.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error creating your cookbook. Please try again.");
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