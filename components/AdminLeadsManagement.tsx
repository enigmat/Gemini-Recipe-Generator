import React from 'react';
import { Lead } from '../types';

interface AdminLeadsManagementProps {
    leads: Lead[];
}

const AdminLeadsManagement: React.FC<AdminLeadsManagementProps> = ({ leads }) => {
    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Collected Leads ({leads.length})</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Collected</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={2} className="px-6 py-12 whitespace-nowrap text-sm text-gray-500 text-center">
                                    No leads collected yet.
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.email}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{lead.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.dateCollected).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLeadsManagement;