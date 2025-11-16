import React, { useState, useMemo, useEffect } from 'react';
import { User, UserData, CalorieEntry, CalorieTrackerSettings } from '../types';
import { updateDatabase } from '../services/database';
import TrashIcon from './icons/TrashIcon';
import Cog6ToothIcon from './icons/Cog6ToothIcon';
import XIcon from './icons/XIcon';
import PlusIcon from './icons/PlusIcon';

interface CalorieTrackerProps {
  currentUser: User;
  userData: UserData;
  forceUpdate: () => void;
}

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const CalorieTracker: React.FC<CalorieTrackerProps> = ({ currentUser, userData, forceUpdate }) => {
    // --- State ---
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    
    // --- Data from props, with defaults ---
    const settings = useMemo(() => userData.calorieSettings || { dailyTarget: 2000 }, [userData.calorieSettings]);
    const entries = useMemo(() => userData.calorieEntries || [], [userData.calorieEntries]);
    
    const todaysEntries = useMemo(() => {
        const today = getTodayDateString();
        return entries.filter(entry => entry.date === today);
    }, [entries]);

    // --- Calculations ---
    const totals = useMemo(() => {
        return todaysEntries.reduce((acc, entry) => {
            acc.calories += entry.calories;
            acc.protein += entry.protein;
            acc.carbs += entry.carbs;
            acc.fat += entry.fat;
            return acc;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
    }, [todaysEntries]);

    const remainingCalories = settings.dailyTarget - totals.calories;
    const progress = settings.dailyTarget > 0 ? (totals.calories / settings.dailyTarget) * 100 : 0;

    // --- Handlers ---
    const handleAddEntry = (entry: Omit<CalorieEntry, 'id' | 'date'>) => {
        const newEntry: CalorieEntry = {
            ...entry,
            id: `cal-${Date.now()}`,
            date: getTodayDateString()
        };
        updateDatabase(db => {
            const userDb = db.userData[currentUser.email];
            if (userDb) {
                if (!userDb.calorieEntries) userDb.calorieEntries = [];
                userDb.calorieEntries.push(newEntry);
            }
        });
        forceUpdate();
    };

    const handleDeleteEntry = (entryId: string) => {
        updateDatabase(db => {
            const userDb = db.userData[currentUser.email];
            if (userDb && userDb.calorieEntries) {
                userDb.calorieEntries = userDb.calorieEntries.filter(e => e.id !== entryId);
            }
        });
        forceUpdate();
    };

    const handleUpdateSettings = (newSettings: CalorieTrackerSettings) => {
        updateDatabase(db => {
            const userDb = db.userData[currentUser.email];
            if (userDb) {
                userDb.calorieSettings = newSettings;
            }
        });
        forceUpdate();
        setIsSettingsModalOpen(false);
    };

    // --- Render ---
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            {/* Summary Section */}
            <div className="bg-white rounded-xl shadow-md p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div className="relative flex justify-center items-center">
                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="12" />
                        <circle
                            cx="60"
                            cy="60"
                            r="54"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="12"
                            strokeDasharray={2 * Math.PI * 54}
                            strokeDashoffset={(2 * Math.PI * 54) * (1 - Math.min(progress, 100) / 100)}
                            strokeLinecap="round"
                            className="transition-all duration-500"
                        />
                    </svg>
                    <div className="absolute text-center">
                        <span className="text-4xl font-bold text-slate-800">{Math.round(remainingCalories)}</span>
                        <span className="block text-slate-500 font-medium">Remaining</span>
                    </div>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                        <h2 className="text-2xl font-bold text-slate-800">Today's Summary</h2>
                         <button onClick={() => setIsSettingsModalOpen(true)} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
                           <Cog6ToothIcon className="w-6 h-6"/>
                        </button>
                    </div>
                    <div className="text-center md:text-left text-lg">
                        <span className="font-bold text-green-600">{totals.calories.toLocaleString()}</span>
                        <span className="text-slate-500"> / {settings.dailyTarget.toLocaleString()} kcal</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <p className="font-bold text-blue-600 text-xl">{totals.protein}g</p>
                            <p className="text-sm text-slate-500">Protein</p>
                        </div>
                        <div>
                            <p className="font-bold text-orange-600 text-xl">{totals.carbs}g</p>
                            <p className="text-sm text-slate-500">Carbs</p>
                        </div>
                        <div>
                            <p className="font-bold text-purple-600 text-xl">{totals.fat}g</p>
                            <p className="text-sm text-slate-500">Fat</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add Entry & Log Section */}
            <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
                <AddEntryForm onAddEntry={handleAddEntry} />
                <TodaysLog entries={todaysEntries} onDeleteEntry={handleDeleteEntry} />
            </div>

            {/* Settings Modal */}
            {isSettingsModalOpen && (
                <SettingsModal
                    currentSettings={settings}
                    onClose={() => setIsSettingsModalOpen(false)}
                    onSave={handleUpdateSettings}
                />
            )}
        </div>
    );
};

// --- Sub-components ---

const AddEntryForm: React.FC<{onAddEntry: (entry: Omit<CalorieEntry, 'id' | 'date'>) => void}> = ({onAddEntry}) => {
    const [name, setName] = useState('');
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const cal = parseInt(calories, 10);
        if (name && !isNaN(cal)) {
            onAddEntry({
                name,
                calories: cal,
                protein: parseInt(protein, 10) || 0,
                carbs: parseInt(carbs, 10) || 0,
                fat: parseInt(fat, 10) || 0,
            });
            // Reset form
            setName(''); setCalories(''); setProtein(''); setCarbs(''); setFat('');
        }
    }

    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Log Food Item</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
                <div className="col-span-2 md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700">Food Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Apple" required className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Calories</label>
                    <input type="number" value={calories} onChange={e => setCalories(e.target.value)} placeholder="kcal" required className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Protein</label>
                    <input type="number" value={protein} onChange={e => setProtein(e.target.value)} placeholder="g" className="mt-1 w-full p-2 border rounded-md" />
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Carbs</label>
                    <input type="number" value={carbs} onChange={e => setCarbs(e.target.value)} placeholder="g" className="mt-1 w-full p-2 border rounded-md" />
                </div>
                <div className="col-span-2 md:col-span-1">
                    <label className="block text-sm font-medium text-slate-700">Fat</label>
                    <div className="flex gap-2">
                        <input type="number" value={fat} onChange={e => setFat(e.target.value)} placeholder="g" className="mt-1 w-full p-2 border rounded-md" />
                         <button type="submit" className="p-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 h-10 aspect-square flex items-center justify-center">
                            <PlusIcon className="w-6 h-6"/>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

const TodaysLog: React.FC<{entries: CalorieEntry[], onDeleteEntry: (id: string) => void}> = ({entries, onDeleteEntry}) => {
    return (
        <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4">Today's Log</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No food logged for today.</p>
                ) : (
                    [...entries].reverse().map(entry => (
                        <div key={entry.id} className="p-3 bg-slate-50 rounded-lg flex items-center gap-4">
                            <div className="flex-grow">
                                <p className="font-semibold text-slate-800">{entry.name}</p>
                                <p className="text-xs text-slate-500">
                                    P: {entry.protein}g &bull; C: {entry.carbs}g &bull; F: {entry.fat}g
                                </p>
                            </div>
                            <p className="font-bold text-green-600">{entry.calories} kcal</p>
                            <button onClick={() => onDeleteEntry(entry.id)} className="p-1 text-red-500 hover:text-red-700">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

const SettingsModal: React.FC<{currentSettings: CalorieTrackerSettings, onClose: () => void, onSave: (s: CalorieTrackerSettings) => void}> = ({currentSettings, onClose, onSave}) => {
    const [target, setTarget] = useState(currentSettings.dailyTarget.toString());
    
    const handleSave = () => {
        const newTarget = parseInt(target, 10);
        if (!isNaN(newTarget) && newTarget > 0) {
            onSave({ dailyTarget: newTarget });
        }
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold">Calorie Target</h3>
                    <button onClick={onClose}><XIcon className="w-6 h-6"/></button>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Daily Calorie Goal (kcal)</label>
                    <input 
                        type="number"
                        value={target}
                        onChange={e => setTarget(e.target.value)}
                        className="mt-1 w-full p-2 border rounded-md"
                        autoFocus
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleSave} className="px-4 py-2 bg-teal-500 text-white font-semibold rounded-md hover:bg-teal-600">
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CalorieTracker;
