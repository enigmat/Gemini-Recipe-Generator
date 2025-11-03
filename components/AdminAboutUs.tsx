import React, { useState, useEffect } from 'react';
import * as aboutUsService from '../services/aboutUsService';
import { AboutUsContent } from '../types';

const AdminAboutUs: React.FC = () => {
    const [content, setContent] = useState<AboutUsContent | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        // FIX: Await promise from async service call before setting state.
        const fetchContent = async () => {
            const data = await aboutUsService.getAboutUsContent();
            setContent(data);
        };
        fetchContent();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!content) return;
        const { name, value } = e.target;
        setContent(prev => ({ ...prev!, [name]: value }));
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content) return;
        setIsSaving(true);
        
        aboutUsService.saveAboutUsContent(content);
        
        // Simulate network delay for user feedback
        setTimeout(() => {
            alert('Information saved successfully!');
            setIsSaving(false);
        }, 1000);
    };

    if (!content) {
        return <div className="text-center p-8">Loading...</div>;
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">About Us Page Content</h2>
            <form onSubmit={handleSave} className="space-y-6">
                <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-slate-700">Company Name</label>
                    <input
                        type="text"
                        name="companyName"
                        id="companyName"
                        value={content.companyName}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="missionStatement" className="block text-sm font-medium text-slate-700">Mission Statement</label>
                    <textarea
                        name="missionStatement"
                        id="missionStatement"
                        rows={4}
                        value={content.missionStatement}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="companyHistory" className="block text-sm font-medium text-slate-700">Company History</label>
                    <textarea
                        name="companyHistory"
                        id="companyHistory"
                        rows={6}
                        value={content.companyHistory}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-slate-700">Contact Email</label>
                    <input
                        type="email"
                        name="contactEmail"
                        id="contactEmail"
                        value={content.contactEmail}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-slate-700">Address</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        value={content.address}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                </div>
                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors disabled:bg-teal-300"
                    >
                        {isSaving ? 'Saving...' : 'Save Information'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAboutUs;