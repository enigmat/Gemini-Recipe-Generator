import React, { useState } from 'react';
import { cookingClasses as initialCookingClasses } from '../data/cookingClasses';
import { CookingClass, ClassStep } from '../types';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';

const AdminCookingClasses: React.FC = () => {
    const [classes, setClasses] = useState<CookingClass[]>(initialCookingClasses);
    const [imagePrompts, setImagePrompts] = useState<Record<string, string>>({});

    const handleClassChange = (classId: string, field: keyof Omit<CookingClass, 'id' | 'steps'>, value: string) => {
        setClasses(prev => prev.map(c => c.id === classId ? { ...c, [field]: value } : c));
    };

    const handleLessonChange = (classId: string, stepId: string, field: keyof Omit<ClassStep, 'id'>, value: string) => {
        setClasses(prev => prev.map(c => {
            if (c.id === classId) {
                const updatedSteps = c.steps.map(s => s.id === stepId ? { ...s, [field]: value } : s);
                return { ...c, steps: updatedSteps };
            }
            return c;
        }));
    };
    
    const handleAddLesson = (classId: string) => {
        const newLesson: ClassStep = {
            id: `s${Date.now()}`,
            title: 'New Lesson',
            duration: '00:00',
            videoUrl: '',
        };
        setClasses(prev => prev.map(c => c.id === classId ? { ...c, steps: [...c.steps, newLesson] } : c));
    };

    const handleDeleteLesson = (classId: string, stepId: string) => {
        setClasses(prev => prev.map(c => {
            if (c.id === classId) {
                return { ...c, steps: c.steps.filter(s => s.id !== stepId) };
            }
            return c;
        }));
    };

    const handleAddClass = () => {
        const newClass: CookingClass = {
            id: `c${Date.now()}`,
            title: 'New Cooking Class',
            chef: 'Chef Name',
            description: 'A brief description of the new class.',
            thumbnailUrl: 'https://via.placeholder.com/400x200.png?text=Class+Image',
            steps: [],
            // FIX: Added missing properties to conform to the CookingClass type.
            whatYouWillLearn: [],
            techniquesCovered: [],
            proTips: [],
        };
        setClasses(prev => [newClass, ...prev]);
    };
    
    const handleDeleteClass = (classId: string) => {
        if (window.confirm('Are you sure you want to delete this entire class? This cannot be undone.')) {
            setClasses(prev => prev.filter(c => c.id !== classId));
        }
    };

    const handleImagePromptChange = (classId: string, value: string) => {
        setImagePrompts(prev => ({ ...prev, [classId]: value }));
    };

    const handleGenerateImage = (classId: string) => {
        const prompt = imagePrompts[classId];
        if (!prompt) {
            alert('Please enter an image prompt.');
            return;
        }
        // In a real app, this would call an AI service.
        console.log(`Generating image for class ${classId} with prompt: "${prompt}"`);
        alert('Image generation initiated! (See console for details)');
    };
    
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Cooking Class Management</h2>
                <button
                    onClick={handleAddClass}
                    className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-white font-semibold rounded-lg shadow-md hover:bg-teal-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5" />
                    <span>Add New Class</span>
                </button>
            </div>
            
            {classes.map((cls) => (
                <div key={cls.id} className="bg-white p-6 rounded-lg shadow-md space-y-6 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Class Details */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-700">Class Details</h3>
                            <div>
                                <label htmlFor={`title-${cls.id}`} className="block text-sm font-medium text-slate-600">Title</label>
                                <input
                                    type="text"
                                    id={`title-${cls.id}`}
                                    value={cls.title}
                                    onChange={(e) => handleClassChange(cls.id, 'title', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor={`chef-${cls.id}`} className="block text-sm font-medium text-slate-600">Chef</label>
                                <input
                                    type="text"
                                    id={`chef-${cls.id}`}
                                    value={cls.chef}
                                    onChange={(e) => handleClassChange(cls.id, 'chef', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label htmlFor={`description-${cls.id}`} className="block text-sm font-medium text-slate-600">Description</label>
                                <textarea
                                    id={`description-${cls.id}`}
                                    value={cls.description}
                                    onChange={(e) => handleClassChange(cls.id, 'description', e.target.value)}
                                    rows={5}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-y"
                                />
                            </div>
                        </div>

                        {/* Class Image */}
                        <div className="space-y-4">
                             <h3 className="text-lg font-semibold text-slate-700">Class Image</h3>
                             <img src={cls.thumbnailUrl} alt={cls.title} className="w-full aspect-video object-cover rounded-md border" />
                             <div>
                                <label htmlFor={`image-prompt-${cls.id}`} className="block text-sm font-medium text-slate-600">New Image Prompt</label>
                                <div className="mt-1 flex gap-2">
                                    <input
                                        type="text"
                                        id={`image-prompt-${cls.id}`}
                                        value={imagePrompts[cls.id] || ''}
                                        onChange={(e) => handleImagePromptChange(cls.id, e.target.value)}
                                        placeholder="e.g., Rustic sourdough bread on a wooden board"
                                        className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                                    />
                                    <button
                                        onClick={() => handleGenerateImage(cls.id)}
                                        className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600 transition-colors"
                                    >
                                        Gen
                                    </button>
                                </div>
                             </div>
                        </div>
                        
                        {/* Lessons */}
                        <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-slate-700">Lessons</h3>
                                <button onClick={() => handleAddLesson(cls.id)} className="text-sm font-medium text-teal-600 hover:text-teal-800 flex items-center gap-1">
                                    <PlusIcon className="w-4 h-4" />
                                    Add
                                </button>
                             </div>
                             <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                                {cls.steps.map((step) => (
                                    <div key={step.id} className="p-3 border rounded-md bg-slate-50/50 space-y-2">
                                        <div className="flex justify-between items-start">
                                            <input
                                                type="text"
                                                value={step.title}
                                                onChange={(e) => handleLessonChange(cls.id, step.id, 'title', e.target.value)}
                                                placeholder="Lesson Title"
                                                className="w-full font-semibold bg-transparent border-none p-0 focus:ring-0"
                                            />
                                            <button onClick={() => handleDeleteLesson(cls.id, step.id)} className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2" aria-label="Delete lesson">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                         <input
                                            type="text"
                                            value={step.duration}
                                            onChange={(e) => handleLessonChange(cls.id, step.id, 'duration', e.target.value)}
                                            placeholder="Duration (e.g., 15:30)"
                                            className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 text-slate-500"
                                        />
                                         <input
                                            type="text"
                                            value={step.videoUrl}
                                            onChange={(e) => handleLessonChange(cls.id, step.id, 'videoUrl', e.target.value)}
                                            placeholder="Video URL"
                                            className="w-full text-sm bg-transparent border-none p-0 focus:ring-0 text-slate-500"
                                        />
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t flex justify-end">
                        <button
                            onClick={() => handleDeleteClass(cls.id)}
                            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                        >
                            Delete Class
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminCookingClasses;