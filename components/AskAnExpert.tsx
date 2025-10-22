import React, { useState } from 'react';
import LockClosedIcon from './icons/LockClosedIcon';
import SparklesIcon from './icons/SparklesIcon';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface AskAnExpertProps {
    isPremium: boolean;
    onUpgrade: () => void;
    isSubmitted: boolean;
    onSubmitQuestion: (question: string) => void;
    onAskAnother: () => void;
}

const AskAnExpert: React.FC<AskAnExpertProps> = ({ isPremium, onUpgrade, isSubmitted, onSubmitQuestion, onAskAnother }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim()) {
            onSubmitQuestion(question);
            setQuestion('');
        }
    };

    if (!isPremium) {
        return (
            <div className="bg-yellow-50 text-yellow-900 p-8 rounded-lg shadow-md text-center my-12 border border-yellow-200">
                <div className="flex justify-center items-center gap-3">
                    <LockClosedIcon className="w-8 h-8 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-yellow-800">Ask an Expert</h2>
                </div>
                <p className="mt-2 text-yellow-700 max-w-md mx-auto">
                    Have a tricky cooking question? Get personalized answers from our professional chefs.
                </p>
                <button
                    onClick={onUpgrade}
                    className="mt-6 px-8 py-3 bg-yellow-400 text-gray-900 font-bold rounded-lg shadow-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-400 transition-colors duration-200 flex items-center gap-2 mx-auto"
                >
                    <SparklesIcon className="w-5 h-5" />
                    <span>Upgrade to Premium</span>
                </button>
            </div>
        );
    }

    if (isSubmitted) {
        return (
             <div className="bg-green-50 text-green-800 p-8 rounded-lg shadow-md text-center my-12 border border-green-200">
                <div className="flex justify-center items-center gap-3">
                    <CheckCircleIcon className="w-10 h-10 text-green-500" />
                    <h2 className="text-2xl font-bold">Question Submitted!</h2>
                </div>
                <p className="mt-2 text-green-700 max-w-md mx-auto">
                    Thank you for your question. Our team of experts will review it and get back to you soon.
                </p>
                 <button
                    onClick={onAskAnother}
                    className="mt-6 px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-500 transition-colors duration-200"
                >
                    Ask Another Question
                </button>
            </div>
        )
    }

    return (
        <div className="my-16 bg-white p-8 rounded-lg shadow-md border border-border-color">
            <div className="text-center">
                <div className="flex justify-center items-center gap-3 text-primary">
                    <QuestionMarkCircleIcon className="w-8 h-8" />
                    <h2 className="text-2xl font-bold">Ask an Expert</h2>
                </div>
                 <p className="mt-2 text-text-secondary max-w-md mx-auto">
                    Stuck on a recipe? Need a substitution, or wondering about a technique? Ask our professional chefs!
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-6 max-w-xl mx-auto">
                 <label htmlFor="expert-question" className="sr-only">
                    Your Question
                </label>
                <textarea
                    id="expert-question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., How can I make my sauces thicker without using flour?"
                    className="w-full p-3 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                    rows={4}
                    required
                />
                <div className="mt-4 text-center">
                    <button
                        type="submit"
                        disabled={!question.trim()}
                        className="px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-focus disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        Submit Question
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AskAnExpert;