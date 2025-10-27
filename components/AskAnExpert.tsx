import React, { useState } from 'react';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

const AskAnExpert: React.FC = () => {
    const [question, setQuestion] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim()) {
            // In a real app, you would send the question to a backend here.
            console.log('Question Submitted:', question);
            setIsSubmitted(true);
        }
    };

    const handleAskAnother = () => {
        setQuestion('');
        setIsSubmitted(false);
    };

    if (isSubmitted) {
        return (
            <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
                <div className="bg-green-50 rounded-xl shadow-md p-8 md:p-12 text-center border border-green-200">
                    <CheckCircleIcon className="w-12 h-12 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-800 mt-4">Question Submitted!</h2>
                    <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                        Thank you for your question. Our team of experts will review it and get back to you soon.
                    </p>
                    <button
                        onClick={handleAskAnother}
                        className="mt-6 px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors text-base"
                    >
                        Ask Another Question
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
                <div className="text-center">
                    <QuestionMarkCircleIcon className="w-10 h-10 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-800 mt-3">Ask an Expert</h2>
                    <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                        Stuck on a recipe? Need a substitution, or wondering about a technique? Ask our professional chefs!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
                    <textarea
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="e.g., How can I make my sauces thicker without using flour?"
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow resize-none"
                        aria-label="Your question"
                    />
                    <div className="text-center mt-6">
                         <button
                            type="submit"
                            disabled={!question.trim()}
                            className="px-10 py-3 bg-slate-500 text-white font-bold rounded-lg shadow-md hover:bg-slate-600 transition-colors text-base disabled:bg-slate-300 disabled:cursor-not-allowed"
                        >
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AskAnExpert;