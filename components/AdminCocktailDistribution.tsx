import React, { useState, useMemo } from 'react';
import { User } from '../types';
import * as adminService from '../services/adminService';
import Spinner from './Spinner';

interface AdminCocktailDistributionProps {
    users: User[];
    currentUser: User;
}

const AdminCocktailDistribution: React.FC<AdminCocktailDistributionProps> = ({ users, currentUser }) => {
    const [sourceUser, setSourceUser] = useState('');
    const [targetUsers, setTargetUsers] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const handleDistribute = async () => {
        if (!sourceUser || targetUsers.length === 0) return;

        if (!window.confirm(`Are you sure you want to send cocktails from ${users.find(u=>u.email === sourceUser)?.name}'s 'My Bar' to ${targetUsers.length} user(s)? This will add cocktails and cannot be undone.`)) {
            return;
        }

        setIsLoading(true);
        setStatus('');
        try {
            // Now an async call
            const { successCount, newCocktails } = await adminService.distributeCocktails(sourceUser, targetUsers);
            setStatus(`Successfully distributed cocktails to ${successCount} user(s). A total of ${newCocktails} new cocktails were added across all users.`);
            setTargetUsers([]); // Clear selection after success
        } catch (e: any) {
            setStatus(`Error: ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectAll = () => {
        const allUserEmails = filteredUsers.map(u => u.email);
        setTargetUsers(allUserEmails);
    };

    const handleDeselectAll = () => {
        setTargetUsers([]);
    };
    
    const filteredUsers = useMemo(() => {
        return users.filter(user => 
            user.email !== sourceUser && 
            (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [users, sourceUser, searchTerm]);

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Distribute 'My Bar' Cocktails</h2>
            <p className="text-slate-600 mb-6">Copy a curated 'My Bar' collection from a source user to multiple target users. This will merge the cocktails, skipping any duplicates.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Source User Selection */}
                <div>
                    <div className="flex justify-between items-baseline mb-2">
                        <label htmlFor="source-user" className="block text-sm font-medium text-slate-700 font-semibold">
                            Step 1: Select Source User
                        </label>
                        <button
                            onClick={() => setSourceUser(currentUser.email)}
                            disabled={sourceUser === currentUser.email}
                            className="text-xs font-semibold text-teal-600 hover:text-teal-800 disabled:text-slate-400 disabled:cursor-not-allowed"
                        >
                            Use My Account as Source
                        </button>
                    </div>
                    <select
                        id="source-user"
                        value={sourceUser}
                        onChange={(e) => {
                            setSourceUser(e.target.value);
                            setTargetUsers(prev => prev.filter(email => email !== e.target.value)); // Deselect if target was same as new source
                        }}
                        className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-shadow bg-white"
                    >
                        <option value="">-- Select a source --</option>
                        {users.map(user => (
                            <option key={user.email} value={user.email}>
                                {user.name} ({user.email}) {user.isAdmin ? '[Admin]' : ''}
                            </option>
                        ))}
                    </select>
                </div>
                
                {/* Target Users Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2 font-semibold">
                        Step 2: Select Target Users
                    </label>
                    <div className="flex gap-2 mb-2">
                         <input
                            type="text"
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                            disabled={!sourceUser}
                        />
                        <button onClick={handleSelectAll} className="px-3 text-sm font-semibold text-teal-600" disabled={!sourceUser}>Select All</button>
                        <button onClick={handleDeselectAll} className="px-3 text-sm font-semibold text-slate-600" disabled={!sourceUser}>Deselect All</button>
                    </div>
                    <div className="border rounded-lg p-2 h-48 overflow-y-auto bg-slate-50">
                        {sourceUser ? (
                            filteredUsers.map(user => (
                                <label key={user.email} className="flex items-center p-2 hover:bg-slate-100 rounded-md cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={targetUsers.includes(user.email)}
                                        onChange={() => {
                                            setTargetUsers(prev => 
                                                prev.includes(user.email) 
                                                ? prev.filter(email => email !== user.email) 
                                                : [...prev, user.email]
                                            );
                                        }}
                                        className="h-4 w-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                                    />
                                    <span className="ml-3 text-sm text-slate-800">{user.name}</span>
                                </label>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 text-center pt-4">Select a source user first.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 border-t pt-6">
                <button
                    onClick={handleDistribute}
                    disabled={isLoading || !sourceUser || targetUsers.length === 0}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-wait"
                >
                    {isLoading ? <Spinner /> : null}
                    <span>{isLoading ? 'Distributing...' : `Distribute to ${targetUsers.length} User(s)`}</span>
                </button>

                {status && (
                    <div className={`mt-4 p-4 rounded-lg text-sm text-center ${status.startsWith('Error:') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                        {status}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCocktailDistribution;