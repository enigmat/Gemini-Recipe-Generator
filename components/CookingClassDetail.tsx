import React from 'react';
import { CookingClass, Lesson } from '../types';
import PlayCircleIcon from './icons/PlayCircleIcon';

interface CookingClassDetailProps {
    cookingClass: CookingClass;
    onBack: () => void;
    onPlayLesson: (lesson: Lesson) => void;
}

const CookingClassDetail: React.FC<CookingClassDetailProps> = ({ cookingClass, onBack, onPlayLesson }) => {
    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <button
                    onClick={onBack}
                    className="mb-4 px-4 py-2 bg-gray-200 text-text-secondary font-semibold rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                    &larr; Back to All Content
                </button>
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">{cookingClass.title}</h1>
                <p className="text-lg text-primary font-semibold mt-1">with {cookingClass.chef}</p>
                <p className="text-text-secondary mt-2 max-w-3xl">{cookingClass.description}</p>
            </div>

            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-text-primary border-b-2 border-primary/20 pb-2">Lessons</h2>
                {cookingClass.lessons.map((lesson, index) => (
                    <div
                        key={lesson.title}
                        onClick={() => onPlayLesson(lesson)}
                        className="bg-white rounded-lg shadow-sm border border-border-color p-4 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-primary/50 transition-all duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onPlayLesson(lesson)}
                    >
                        <div className="text-3xl font-bold text-primary/50 flex-shrink-0 w-8 text-center">{index + 1}</div>
                        <div className="w-32 h-20 rounded-md overflow-hidden flex-shrink-0 relative group">
                            <img src={lesson.thumbnailUrl} alt={lesson.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                             <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                <PlayCircleIcon className="w-8 h-8 text-white/80" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h3 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">{lesson.title}</h3>
                            <p className="text-sm text-text-secondary mt-1">Duration: {lesson.duration}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CookingClassDetail;