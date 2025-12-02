import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Register the service worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl w-full border-t-8 border-red-500">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">Something went wrong</h1>
            <p className="text-slate-600 mb-6">The application encountered an unexpected error and could not load.</p>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 overflow-auto max-h-64">
              <code className="text-sm text-red-800 font-mono whitespace-pre-wrap">
                {this.state.error?.toString()}
              </code>
            </div>

            <div className="flex gap-4">
                <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Clear Cache & Reload
                </button>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-slate-200 text-slate-800 font-bold rounded-lg hover:bg-slate-300 transition-colors"
                >
                    Try Reloading
                </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
  </React.StrictMode>
);