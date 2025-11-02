import React, { useState } from 'react';
import { AppDatabase } from '../types';
import { exportDatabaseWithImages } from '../services/dataSyncService';
import DownloadIcon from './icons/DownloadIcon';
import UploadIcon from './icons/UploadIcon';
import Spinner from './Spinner';
import QuestionMarkCircleIcon from './icons/QuestionMarkCircleIcon';
import DataSyncGuide from './DataSyncGuide';

interface AdminDataSyncProps {
    onImportData: (db: AppDatabase) => Promise<void>;
}

const AdminDataSync: React.FC<AdminDataSyncProps> = ({ onImportData }) => {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [importFile, setImportFile] = useState<File | null>(null);
    const [importError, setImportError] = useState<string | null>(null);
    const [isGuideVisible, setIsGuideVisible] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const dbWithImages = await exportDatabaseWithImages();
            const jsonString = JSON.stringify(dbWithImages, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `recipe-extracter-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Data export failed. See console for details.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setImportError(null);
        const file = e.target.files?.[0];
        if (file) {
            if (file.type !== 'application/json') {
                setImportError('Invalid file type. Please upload a .json file.');
                setImportFile(null);
                return;
            }
            setImportFile(file);
        }
    };

    const handleImport = async () => {
        if (!importFile) return;

        if (!window.confirm("Are you sure you want to import this data? This will OVERWRITE all existing data on this device. This action cannot be undone.")) {
            return;
        }

        setIsImporting(true);
        setImportError(null);
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("Could not read file content.");
                }
                const importedDb = JSON.parse(text);
                await onImportData(importedDb);
                // App will reload via onImportData on success
            } catch (error: any) {
                console.error("Import failed:", error);
                setImportError(`Import failed: ${error.message}`);
                setIsImporting(false);
            }
        };
        reader.onerror = () => {
            setImportError("Failed to read the file.");
            setIsImporting(false);
        };
        reader.readAsText(importFile);
    };

    return (
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                 <button 
                    onClick={() => setIsGuideVisible(!isGuideVisible)}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-teal-600 hover:text-teal-800"
                >
                    <QuestionMarkCircleIcon className="w-5 h-5" />
                    <span>How does this work?</span>
                </button>
            </div>

            {isGuideVisible && <DataSyncGuide />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Export Section */}
                <div className="space-y-4 p-6 border rounded-lg">
                    <h3 className="text-xl font-bold text-slate-800">Export Application Data</h3>
                    <p className="text-sm text-slate-600">Download a single backup file (.json) containing all your recipes, users, products, settings, and embedded images. You can use this file to transfer your data to another device.</p>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                    >
                        {isExporting ? <Spinner /> : <DownloadIcon className="w-5 h-5" />}
                        <span>{isExporting ? 'Preparing Export...' : 'Export All Data & Images'}</span>
                    </button>
                </div>

                {/* Import Section */}
                <div className="space-y-4 p-6 border border-red-200 bg-red-50/50 rounded-lg">
                    <h3 className="text-xl font-bold text-red-800">Import Application Data</h3>
                    <p className="text-sm text-red-700 font-semibold">
                        <span className="font-bold">WARNING:</span> Importing a file will completely overwrite all existing data on this device. This action is irreversible.
                    </p>
                    <div>
                        <input
                            type="file"
                            accept=".json"
                            onChange={handleFileChange}
                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                            disabled={isImporting}
                        />
                    </div>
                    <button
                        onClick={handleImport}
                        disabled={isImporting || !importFile}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
                    >
                        {isImporting ? <Spinner /> : <UploadIcon className="w-5 h-5" />}
                        <span>{isImporting ? 'Importing Data...' : 'Import and Overwrite Data'}</span>
                    </button>
                    {importError && <p className="text-red-600 text-sm font-semibold mt-2 text-center">{importError}</p>}
                </div>
            </div>
        </div>
    );
};
export default AdminDataSync;