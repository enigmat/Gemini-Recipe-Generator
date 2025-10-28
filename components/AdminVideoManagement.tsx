import React, { useState, useEffect } from 'react';
import { videos as initialVideos } from '../data/videos';
import { Video } from '../types';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import SparklesIcon from './icons/SparklesIcon';

type VideosByCategory = Record<string, Video[]>;

const AdminVideoManagement: React.FC = () => {
    const [videosByCategory, setVideosByCategory] = useState<VideosByCategory>({});
    const [aiPrompts, setAiPrompts] = useState<Record<string, string>>({});

    useEffect(() => {
        const groupedVideos = initialVideos.reduce((acc, video) => {
            const { category } = video;
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(video);
            return acc;
        }, {} as VideosByCategory);
        setVideosByCategory(groupedVideos);
    }, []);

    const handleDeleteCategory = (category: string) => {
        if (window.confirm(`Are you sure you want to delete the entire "${category}" category and all its videos?`)) {
            setVideosByCategory(prev => {
                const newCategories = { ...prev };
                delete newCategories[category];
                return newCategories;
            });
        }
    };
    
    const handleAddCategory = () => {
        const newCategoryName = `New Category ${Object.keys(videosByCategory).length + 1}`;
        setVideosByCategory(prev => ({
            [newCategoryName]: [], // Add to top
            ...prev,
        }));
    };

    const handleVideoChange = (category: string, videoId: string, field: keyof Omit<Video, 'id' | 'category'>, value: string) => {
        setVideosByCategory(prev => ({
            ...prev,
            [category]: prev[category].map(video =>
                video.id === videoId ? { ...video, [field]: value } : video
            )
        }));
    };

    const handleDeleteVideo = (category: string, videoId: string) => {
        setVideosByCategory(prev => ({
            ...prev,
            [category]: prev[category].filter(video => video.id !== videoId)
        }));
    };
    
    const handleAddBlankVideo = (category: string) => {
        const newVideo: Video = {
            id: `vid${Date.now()}`,
            category: category,
            title: '',
            description: '',
            videoUrl: '',
            thumbnailUrl: '',
        };
        setVideosByCategory(prev => ({
            ...prev,
            [category]: [...prev[category], newVideo]
        }));
    };
    
    const handleAiPromptChange = (category: string, value: string) => {
        setAiPrompts(prev => ({ ...prev, [category]: value }));
    };

    const handleGenerateAndAdd = (category: string) => {
        const prompt = aiPrompts[category];
        if (!prompt) {
            alert('Please enter a prompt for the AI.');
            return;
        }
        console.log(`Generating video for category "${category}" with prompt: "${prompt}"`);
        alert('AI generation is a placeholder. See console for details.');
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Video Management</h2>
                <button
                    onClick={handleAddCategory}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add New Category</span>
                </button>
            </div>

            {Object.keys(videosByCategory).length === 0 && (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                    <p className="text-slate-500">No video categories found. Click "Add New Category" to get started.</p>
                </div>
            )}
            {/* FIX: Replaced `Object.entries` with `Object.keys` to prevent a potential type inference issue where the `videos` array was being incorrectly typed as `unknown`. This ensures that `videos` is correctly recognized as an array, allowing the `.map` method to be used without causing a type error. */}
            {Object.keys(videosByCategory).map((category) => {
                const videos = videosByCategory[category];
                return (
                <div key={category} className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-slate-800">{category}</h2>
                        <button onClick={() => handleDeleteCategory(category)} className="text-red-500 hover:text-red-700" aria-label={`Delete category ${category}`}>
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {videos.map(video => (
                             <div key={video.id} className="grid grid-cols-12 gap-4 border p-4 rounded-lg bg-white">
                                <div className="col-span-12 md:col-span-5 space-y-2">
                                    <input
                                        type="text"
                                        value={video.title}
                                        onChange={(e) => handleVideoChange(category, video.id, 'title', e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Video Title"
                                    />
                                    <textarea
                                        value={video.description}
                                        onChange={(e) => handleVideoChange(category, video.id, 'description', e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm h-20 resize-none text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Video Description"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-7 space-y-2">
                                    <input
                                        type="text"
                                        value={video.thumbnailUrl}
                                        onChange={(e) => handleVideoChange(category, video.id, 'thumbnailUrl', e.target.value)}
                                        className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                        placeholder="Thumbnail URL"
                                    />
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={video.videoUrl}
                                            onChange={(e) => handleVideoChange(category, video.id, 'videoUrl', e.target.value)}
                                            className="w-full p-2 bg-white border border-slate-300 rounded-md text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                            placeholder="Video URL"
                                        />
                                        <button onClick={() => handleDeleteVideo(category, video.id)} className="text-red-500 hover:text-red-700" aria-label={`Delete video ${video.title}`}>
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="border-t-2 border-dashed border-slate-200 pt-6">
                        <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <SparklesIcon className="w-5 h-5 text-blue-500" />
                                <h4 className="font-semibold text-slate-700">Generate with AI</h4>
                            </div>
                            <input
                                type="text"
                                value={aiPrompts[category] || ''}
                                onChange={(e) => handleAiPromptChange(category, e.target.value)}
                                placeholder="e.g., A quick tutorial on making a simple vinaigrette"
                                className="w-full p-2 border border-slate-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                            />
                            <div className="flex justify-end gap-2 mt-4">
                                <button onClick={() => handleAddBlankVideo(category)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors">
                                    <PlusIcon className="w-4 h-4" />
                                    <span>Add Blank</span>
                                </button>
                                <button onClick={() => handleGenerateAndAdd(category)} className="flex items-center justify-center gap-2 px-3 py-2 text-sm bg-teal-500 text-white font-semibold rounded-lg hover:bg-teal-600 transition-colors">
                                    <SparklesIcon className="w-4 h-4" />
                                    <span>Generate & Add</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                );
            })}
        </div>
    );
};

export default AdminVideoManagement;