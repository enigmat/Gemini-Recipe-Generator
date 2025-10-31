import { Recipe } from '../types';

export const generateRecipeExportHtml = (recipes: Recipe[]): string => {
    const recipeElements = recipes
        .map(recipe => `<div class="recipe"><h1 class="fn">${recipe.title}</h1></div>`)
        .join('\n');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Monthly Recipe Export</title>
</head>
<body>
    ${recipeElements}
</body>
</html>
    `;
};

export const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href);
};
