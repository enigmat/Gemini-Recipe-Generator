import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  return (
    <div className="text-center py-16 px-6 bg-white rounded-lg shadow-sm">
      <div className="mx-auto w-16 h-16 text-gray-400">
        {icon}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-gray-800">{title}</h3>
      <p className="mt-2 text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
