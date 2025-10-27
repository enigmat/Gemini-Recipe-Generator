import React, { useState } from 'react';
import { ExpertQuestion } from '../types';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface AskAnExpertProps {
    questions: ExpertQuestion[];
    onAskQuestion: (question: string, topic: string) => void;
}

const AskAnExpert: React.FC<AskAnExpertProps> = ({ questions, onAskQuestion }) => {
    const [question, setQuestion] = useState('');
    const [topic, setTopic] = useState('General Inquiry');
    const [expandedId, setExpandedId] = useState<string | null>(questions.find(q => q.status === 'Answered')?.id || null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (question.trim() && topic) {
            onAskQuestion(question, topic);
            setQuestion('');
            setTopic('General Inquiry');
        }
    };

    const topics = ["General Inquiry", "Technique", "Ingredient Substitution", "Food Safety", "Recipe Troubleshooting"];

    return (
        <div className="max-w-4xl mx-auto mt-8 animate-fade-in space-y-12">
            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
                <div className="text-center">
                    <QuestionMarkCircleIcon className="w-10 h-10 text-green-500 mx-auto" />
                    <h2 className="text-2xl font-bold text-gray-800 mt-3">Ask an Expert</h2>
                    <p className="text-gray-600 mt-2 max-w-lg mx-auto">
                        Stuck on a recipe? Need a substitution, or wondering about a technique? Ask our professional chefs!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto space-y-4">
                     <div>
                        <label htmlFor="topic-select" className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
                        <select
                            id="topic-select"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-white"
                        >
                            {topics.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="question-textarea" className="block text-sm font-medium text-gray-700 mb-1">Your Question</label>
                        <textarea
                            id="question-textarea"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g., How can I make my sauces thicker without using flour?"
                            className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow resize-none"
                            aria-label="Your question"
                            required
                        />
                    </div>
                    <div className="text-center pt-2">
                         <button
                            type="submit"
                            disabled={!question.trim()}
                            className="px-10 py-3 bg-teal-500 text-white font-bold rounded-lg shadow-md hover:bg-teal-600 transition-colors text-base disabled:bg-teal-300 disabled:cursor-not-allowed"
                        >
                            Submit Question
                        </button>
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 md:p-12">
                <h3 className="text-xl font-bold text-gray-800 mb-6">Your Question History</h3>
                <div className="space-y-4">
                    {questions.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">You haven't asked any questions yet.</p>
                    ) : (
                        questions.map(q => (
                            <div key={q.id} className="border rounded-lg">
                                <button
                                    className="w-full p-4 text-left flex justify-between items-center"
                                    onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                                    aria-expanded={expandedId === q.id}
                                >
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${q.status === 'Answered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {q.status}
                                            </span>
                                            <p className="font-semibold text-gray-800 text-left">{q.question}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Topic: {q.topic} &bull; Submitted: {new Date(q.submittedDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ml-4 ${expandedId === q.id ? 'rotate-180' : ''}`} />
                                </button>
                                {expandedId === q.id && (
                                    <div className="p-4 border-t bg-gray-50/50 animate-fade-in text-left">
                                        {q.status === 'Answered' && q.answer ? (
                                            <div className="space-y-2">
                                                <p className="text-sm font-semibold text-gray-700">
                                                    Answer from Chef {q.answer.chefName}
                                                    <span className="text-xs font-normal text-gray-500 ml-2">({new Date(q.answer.answeredDate).toLocaleDateString()})</span>
                                                </p>
                                                <p className="text-gray-600 text-sm whitespace-pre-wrap">{q.answer.text}</p>
                                            </div>
                                        ) : (
                                            <p className="text-gray-600 text-sm">Our chefs are reviewing your question. We'll get back to you shortly!</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AskAnExpert;