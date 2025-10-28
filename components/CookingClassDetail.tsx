import React, { useState } from 'react';
import { CookingClass } from '../types';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import PlayCircleIcon from './icons/PlayCircleIcon';
import MortarPestleIcon from './icons/MortarPestleIcon';
import GraduationCapIcon from './icons/GraduationCapIcon';
import SparklesIcon from './icons/SparklesIcon';
import CheckIcon from './icons/CheckIcon';

interface CookingClassDetailProps {
  cookingClass: CookingClass;
  onBack: () => void;
}

const CookingClassDetail: React.FC<CookingClassDetailProps> = ({ cookingClass, onBack }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const currentStep = cookingClass.steps[currentStepIndex];

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <button 
            onClick={onBack} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-semibold mb-4"
        >
            <ChevronLeftIcon className="w-5 h-5" />
            Back to All Classes
        </button>
        <h2 className="text-3xl font-bold text-slate-800">{cookingClass.title}</h2>
        <p className="text-lg text-slate-600 mt-2">{cookingClass.description}</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Video Player */}
        <div className="w-full md:w-2/3">
          <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
             <video
                key={currentStep.videoUrl}
                src={currentStep.videoUrl}
                controls
                autoPlay
                className="w-full h-full"
             >
                Your browser does not support the video tag.
             </video>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-slate-800">Step {currentStepIndex + 1}: {currentStep.title}</h3>
          </div>
        </div>

        {/* Playlist Sidebar */}
        <div className="w-full md:w-1/3">
            <div className="bg-white p-4 rounded-lg shadow-sm max-h-[60vh] overflow-y-auto">
                <h4 className="text-lg font-bold text-slate-800 mb-3">Class Playlist</h4>
                <ul className="space-y-2">
                    {cookingClass.steps.map((step, index) => (
                       <li key={step.id}>
                           <button 
                                onClick={() => setCurrentStepIndex(index)}
                                className={`w-full text-left p-3 rounded-md transition-colors flex items-center gap-3 ${
                                    index === currentStepIndex 
                                    ? 'bg-amber-100 text-amber-800' 
                                    : 'hover:bg-slate-100'
                                }`}
                           >
                            <PlayCircleIcon className={`w-6 h-6 flex-shrink-0 ${
                                index === currentStepIndex ? 'text-amber-600' : 'text-slate-400'
                            }`} />
                            <div>
                                <span className="font-semibold block">Step {index + 1}</span>
                                <span className="text-sm text-slate-600">{step.title}</span>
                            </div>
                           </button>
                       </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
                <MortarPestleIcon className="w-6 h-6 text-teal-600" />
                <h4 className="text-lg font-bold text-slate-800">Techniques Covered</h4>
            </div>
            <ul className="space-y-2">
                {cookingClass.techniquesCovered.map((tech, i) => (
                    <li key={i} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{tech}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center gap-3 mb-3">
                <GraduationCapIcon className="w-6 h-6 text-teal-600" />
                <h4 className="text-lg font-bold text-slate-800">What You'll Learn</h4>
            </div>
             <ul className="space-y-2">
                {cookingClass.whatYouWillLearn.map((item, i) => (
                    <li key={i} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-teal-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600">{item}</span>
                    </li>
                ))}
            </ul>
        </div>
        <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-200">
            <div className="flex items-center gap-3 mb-3">
                <SparklesIcon className="w-6 h-6 text-amber-500" />
                <h4 className="text-lg font-bold text-slate-800">Pro Tips</h4>
            </div>
             <ul className="space-y-2">
                {cookingClass.proTips.map((tip, i) => (
                     <li key={i} className="flex items-start">
                        <SparklesIcon className="w-4 h-4 text-amber-400 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-amber-800 font-medium">{tip}</span>
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default CookingClassDetail;