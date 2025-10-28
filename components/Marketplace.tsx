import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import ProductCard from './ProductCard';
import SearchBar from './SearchBar';
import ProductAnalyzer from './ProductAnalyzer';

interface MarketplaceProps {
    allProducts: Product[];
}

const Marketplace: React.FC<MarketplaceProps> = ({ allProducts }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(allProducts.map(p => p.category))].sort();
        return ['All', ...uniqueCategories];
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter(product => {
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  product.description.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [allProducts, searchQuery, selectedCategory]);

    return (
        <div className="space-y-12">
            <ProductAnalyzer />

            <div>
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-gray-800">Shop Our Favorites</h2>
                    <div className="w-full md:w-auto md:max-w-xs">
                        <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search products..." />
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {categories.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                                selectedCategory === category
                                ? 'bg-teal-500 text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:bg-teal-100 shadow-sm border border-gray-200'
                            }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
                        <h3 className="mt-4 text-xl font-semibold text-gray-800">No Products Found</h3>
                        <p className="mt-2 text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Marketplace;