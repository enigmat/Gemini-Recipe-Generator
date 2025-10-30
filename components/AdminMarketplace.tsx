import React, { useState } from 'react';
import { Product } from '../types';
import * as marketplaceService from '../services/marketplaceService';
import { generateProductFromPrompt, generateImage } from '../services/geminiService';
import * as imageStore from '../services/imageStore';
import StoredImage from './StoredImage';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import PlusIcon from './icons/PlusIcon';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import Spinner from './Spinner';

interface AdminMarketplaceProps {
    products: Product[];
    onUpdateProducts: (updatedProducts: Product[]) => void;
}

const AdminMarketplace: React.FC<AdminMarketplaceProps> = ({ products, onUpdateProducts }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '', brand: '', description: '', imageUrl: '', affiliateUrl: '', category: ''
    });
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [updatingImageId, setUpdatingImageId] = useState<string | null>(null);
    const [generateError, setGenerateError] = useState<string | null>(null);

    const handleOpenModal = (product: Product | null) => {
        setEditingProduct(product);
        if (product) {
            setFormData(product);
        } else {
            setFormData({ name: '', brand: '', description: '', imageUrl: '', affiliateUrl: '', category: '' });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        let updatedProducts: Product[];
        if (editingProduct) {
            const finalProduct = { ...formData, id: editingProduct.id };
            updatedProducts = products.map(p => p.id === editingProduct.id ? finalProduct : p);
        } else {
            const newProduct = { ...formData, id: `prod${Date.now()}` };
            updatedProducts = [newProduct, ...products];
        }
        onUpdateProducts(updatedProducts);
        handleCloseModal();
    };

    const handleDelete = (productId: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            const productToDelete = products.find(p => p.id === productId);
            if (productToDelete && productToDelete.imageUrl.startsWith('indexeddb:')) {
                imageStore.deleteImage(productId);
            }
            const updatedProducts = products.filter(p => p.id !== productId);
            onUpdateProducts(updatedProducts);
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

            const updatedProduct = { ...product, imageUrl: `indexeddb:${product.id}` };
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
                        {products.map(product => (
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
                                <label className="block text-sm font-medium text-slate-700">Image URL</label>
                                <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent" required />
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