import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center py-8 md:py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                Simple Recipes
            </h1>
            <p className="text-lg text-text-secondary">
                Browse our collection or enter your ingredients to find a new recipe.
            </p>
        </header>
    );
};

export default Header;