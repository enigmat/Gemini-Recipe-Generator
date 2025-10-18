import React, { useState } from 'react';
import { User, SubscriptionHistory } from '../types';
import XIcon from './icons/XIcon';

interface EditUserModalProps {
    user: User;
    onClose: () => void;
    onSave: (email: string, updatedData: Partial<User>) => void;
    onGiveFreeTime: (email: string, months: number) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onSave, onGiveFreeTime }) => {
    const [name, setName] = useState(user.name);

    const handleSave = () => {
        onSave(user.email, { name });
        onClose();
    };

    const hasActiveSubscription = user.subscription && user.subscription.status === 'active' && new Date(user.subscription.endDate) >= new Date();

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border-color flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-text-primary">Edit User: {user.email}</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    {/* User Details */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">User Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="userName" className="block text-sm font-medium text-text-secondary">Name</label>
                                <input
                                    id="userName"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-border-color rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary">Joined On</label>
                                <p className="mt-1 block w-full px-3 py-2 bg-gray-50 rounded-md">{user.joinDate}</p>
                            </div>
                        </div>
                    </div>

                    {/* Subscription Management */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Subscription</h3>
                        <div className="bg-gray-50 border border-border-color rounded-lg p-4 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">Status</p>
                                    <p className={`font-bold ${hasActiveSubscription ? 'text-green-600' : 'text-red-600'}`}>
                                        {hasActiveSubscription ? 'Active' : 'Inactive'}
                                    </p>
                                </div>
                                {hasActiveSubscription && user.subscription && (
                                    <div>
                                        <p className="text-sm font-medium text-text-secondary">Plan Ends</p>
                                        <p className="font-bold text-text-primary">{user.subscription.endDate}</p>
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-text-secondary mb-2">Grant Free Premium</p>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={() => onGiveFreeTime(user.email, 1)} className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-focus">1 Month</button>
                                    <button onClick={() => onGiveFreeTime(user.email, 6)} className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-focus">6 Months</button>
                                    <button onClick={() => onGiveFreeTime(user.email, 12)} className="px-3 py-1 bg-primary text-white text-sm font-semibold rounded-md hover:bg-primary-focus">1 Year</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Subscription History */}
                    <div>
                        <h3 className="text-lg font-semibold text-primary mb-2">Subscription History</h3>
                        <div className="border border-border-color rounded-lg overflow-hidden">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Action</th>
                                        <th className="px-4 py-2">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.subscriptionHistory && user.subscriptionHistory.length > 0 ? (
                                        user.subscriptionHistory.map((entry, index) => (
                                            <tr key={index} className="bg-white border-b last:border-b-0">
                                                <td className="px-4 py-2">{entry.date}</td>
                                                <td className="px-4 py-2 font-medium">{entry.action}</td>
                                                <td className="px-4 py-2">{entry.description}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4 text-gray-500">No subscription history.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-border-color flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-text-primary font-semibold rounded-lg hover:bg-gray-300">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default EditUserModal;