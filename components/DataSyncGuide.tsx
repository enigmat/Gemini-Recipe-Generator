import React from 'react';

const DataSyncGuide: React.FC = () => {
    return (
        <div className="bg-slate-50 border border-slate-200 rounded-lg animate-fade-in flex justify-center items-center p-4">
            <iframe
                src="https://gamma.app/embed/qccxr47qcfj3jpt"
                style={{
                    width: '700px',
                    maxWidth: '100%',
                    height: '450px',
                    border: 'none',
                    borderRadius: '8px',
                }}
                allowFullScreen
                title="Sync Your App Data Across All Your Devices"
            ></iframe>
        </div>
    );
};

export default DataSyncGuide;
