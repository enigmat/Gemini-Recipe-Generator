
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="text-center py-8 md:py-12">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-2">
                RecipeGenius
            </h1>
            <p className="text-lg text-text-secondary">
                Turn your ingredients into delicious meals.
            </p>
        </header>
    );
};

export default Header;
