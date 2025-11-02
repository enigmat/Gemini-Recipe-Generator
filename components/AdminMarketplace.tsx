import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import * as imageStore from '../services/imageStore';
import { generateProductFromPrompt, generateImage } from '../services/geminiService';
import StoredImage from './StoredImage';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import PlusIcon from './icons/PlusIcon';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';
import StoreIcon from './icons/StoreIcon';

interface AdminMarketplaceProps {
    products: Product[];
    onUpdateProducts: (updatedProducts: Product[]) => void;
    onDeleteProduct: (productId: string) => void;
}

const AdminMarketplace: React.FC<AdminMarketplaceProps> = ({ products, onUpdateProducts, onDeleteProduct }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '', brand: '', description: '', imageUrl: '', affiliateUrl: '', category: ''
    });
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [updatingImageId, setUpdatingImageId] = useState<string | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);

    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('name-asc');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = useMemo(() => {
        const uniqueCategories = [...new Set(products.map(p => p.category))].sort();
        return ['All', ...uniqueCategories];
    }, [products]);

    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...products];

        if (filterCategory !== 'All') {
            filtered = filtered.filter(p => p.category === filterCategory);
        }

        if (searchTerm) {
            const lowercasedTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(lowercasedTerm) ||
                p.brand.toLowerCase().includes(lowercasedTerm)
            );
        }

        const sortFunctions: { [key: string]: (a: Product, b: Product) => number } = {
            'name-asc': (a, b) => a.name.localeCompare(b.name),
            'name-desc': (a, b) => b.name.localeCompare(a.name),
            'brand-asc': (a, b) => a.brand.localeCompare(b.brand),
            'brand-desc': (a, b) => b.brand.localeCompare(a.brand),
        };
        
        filtered.sort(sortFunctions[sortBy]);

        return filtered;
    }, [products, filterCategory, sortBy, searchTerm]);

    const handleOpenModal = (product: Product | null) => {
        setEditingProduct(product);
        if (product) {
            setFormData(product);
            setImagePreview(product.imageUrl);
        } else {
            setFormData({ name: '', brand: '', description: '', imageUrl: '', affiliateUrl: '', category: '' });
            setImagePreview(null);
        }
        setSelectedFile(null); // always reset file
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setImagePreview(null);
        setSelectedFile(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                alert('Invalid file type. Please use JPG, PNG, GIF, or WEBP.');
                return;
            }
            const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
            if (file.size > maxSizeInBytes) {
                alert('File is too large. Please select an image under 5MB.');
                return;
            }

            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let updatedProducts: Product[];
        const productId = editingProduct ? editingProduct.id : `prod${Date.now()}`;
        let finalImageUrl = formData.imageUrl;

        if (selectedFile) {
            const promise = new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(selectedFile);
            });
            const base64Image = await promise;
            
            await imageStore.setImage(productId, base64Image);
            finalImageUrl = `indexeddb:${productId}`;
        }

        if (editingProduct) {
            const finalProduct = { ...formData, id: editingProduct.id, imageUrl: finalImageUrl };
            updatedProducts = products.map(p => p.id === editingProduct.id ? finalProduct : p);
        } else {
            if (!finalImageUrl && !selectedFile) {
                alert("Please select an image for the new product.");
                return;
            }
            const newProduct = { ...formData, id: productId, imageUrl: finalImageUrl };
            updatedProducts = [newProduct, ...products];
        }
        onUpdateProducts(updatedProducts);
        handleCloseModal();
    };

    const handleDelete = (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            onDeleteProduct(productId);
        }
    };

    const handleGenerateProduct = async () => {
        if (!aiPrompt.trim()) return;

        setIsGenerating(true);
        setGenerateError(null);
        try {
            const { imagePrompt, ...productDetails } = await generateProductFromPrompt(aiPrompt);
            const imageUrl_base64 = await generateImage(imagePrompt);

            const newProductId = `prod${Date.now()}`;
            
            const newProduct: Product = {
                id: newProductId,
                ...productDetails,
                imageUrl: `indexeddb:${newProductId}`,
                affiliateUrl: 'https://www.example.com/placeholder'
            };

            await imageStore.setImage(newProductId, imageUrl_base64);

            const updatedProducts = [newProduct, ...products];
            onUpdateProducts(updatedProducts);
            
            setAiPrompt('');
        } catch (err: any) {
            setGenerateError(err.message || 'An error occurred during AI generation.');
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleUpdateImage = async (product: Product) => {
        if (!window.confirm(`Are you sure you want to regenerate the image for "${product.name}" using AI?`)) {
            return;
        }
        setUpdatingImageId(product.id);
        try {
            const prompt = `A professional, clean product photo of ${product.name} from the brand ${product.brand}, on a pure white background. Studio lighting.`;
            const newImageUrl_base64 = await generateImage(prompt);

            await imageStore.setImage(product.id, newImageUrl_base64);

            // Add cache-buster to ensure the image component re-renders
            const updatedProduct = { ...product, imageUrl: `indexeddb:${product.id}?t=${Date.now()}` };
            const updatedProducts = products.map(p => p.id === product.id ? updatedProduct : p);
            onUpdateProducts(updatedProducts);
        } catch (error) {
            console.error("Failed to update product image:", error);
            alert("Failed to update product image. Please try again.");
        } finally {
            setUpdatingImageId(null);
        }
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800">Marketplace Management</h2>
                <button
                    onClick={() => handleOpenModal(null)}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add Product</span>
                </button>
            </div>

            <div className="mb-8 p-6 border border-slate-200 rounded-lg bg-slate-50/50">
                <div className="flex items-center gap-2">
                    <SparklesIcon className="w-6 h-6 text-teal-500" />
                    <h3 className="text-xl font-bold text-slate-800">Generate Product with AI</h3>
                </div>
                <p className="text-sm text-slate-600 mt-2 mb-4">
                    Describe a product, and AI will generate its details, an image, and add it to the marketplace.
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="e.g., A high-quality non-stick pan for everyday cooking"
                        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow"
                        disabled={isGenerating}
                    />
                    <button
                        onClick={handleGenerateProduct}
                        className="px-6 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors flex items-center justify-center disabled:bg-teal-300 disabled:cursor-wait"
                        disabled={!aiPrompt.trim() || isGenerating}
                    >
                        {isGenerating ? <Spinner /> : 'Generate'}
                    </button>
                </div>
                {generateError && <p className="text-red-500 text-sm mt-2">{generateError}</p>}
            </div>

            <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-slate-50/50">
                <div>
                    <label htmlFor="search-product" className="block text-sm font-medium text-slate-700">Search</label>
                    <input
                        type="text"
                        id="search-product"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search by name or brand..."
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="filter-category" className="block text-sm font-medium text-slate-700">Category</label>
                    <select
                        id="filter-category"
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                    >
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="sort-by" className="block text-sm font-medium text-slate-700">Sort By</label>
                    <select
                        id="sort-by"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md"
                    >
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="brand-asc">Brand (A-Z)</option>
                        <option value="brand-desc">Brand (Z-A)</option>
                    </select>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                        {filteredAndSortedProducts.map(product => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <StoredImage className="h-10 w-10 rounded-md object-cover" src={product.imageUrl} alt={product.name} />
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-slate-900">{product.name}</div>
                                            <div className="text-sm text-slate-500">{product.brand}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => handleUpdateImage(product)}
                                            disabled={updatingImageId !== null}
                                            className="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                                            title={`Regenerate image for ${product.name}`}
                                        >
                                            {updatingImageId === product.id ? <Spinner size="w-5 h-5" /> : <SparklesIcon className="w-5 h-5" />}
                                        </button>
                                        <button onClick={() => handleOpenModal(product)} disabled={updatingImageId !== null} className="text-slate-600 hover:text-slate-900 disabled:opacity-50">
                                            <PencilIcon className="w-5 h-5" />
                                        </button>
                                        <button onClick={() => handleDelete(product.id)} disabled={updatingImageId !== null} className="text-red-600 hover:text-red-900 disabled:opacity-50">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={handleCloseModal}>
                    <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-lg m-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-800">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                            <button onClick={handleCloseModal}><XIcon className="w-6 h-6 text-slate-500" /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Product Image</label>
                                <div className="mt-1 flex items-center gap-4">
                                    {imagePreview ? (
                                        <StoredImage src={imagePreview} alt="Product preview" className="w-20 h-20 object-cover rounded-md border" />
                                    ) : (
                                        <div className="w-20 h-20 bg-slate-100 rounded-md flex items-center justify-center text-slate-400">
                                            <StoreIcon className="w-10 h-10" />
                                        </div>
                                    )}
                                    <input 
                                        type="file" 
                                        name="imageFile" 
                                        onChange={handleImageFileChange} 
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100" 
                                        accept="image/png, image/jpeg, image/gif, image/webp"
                                        required={!editingProduct}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Product Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Brand</label>
                                <input type="text" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Category</label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Affiliate URL</label>
                                <input type="url" name="affiliateUrl" value={formData.affiliateUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
                            </div>
                            <div className="flex justify-end gap-3 pt-4">
                                <button type="button" onClick={handleCloseModal} className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminMarketplace;