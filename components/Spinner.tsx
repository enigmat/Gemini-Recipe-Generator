import React from 'react';

const Spinner: React.FC<{ size?: string }> = ({ size = 'w-5 h-5' }) => (
  <div
    className={`animate-spin rounded-full border-2 border-t-transparent border-current ${size}`}
    role="status"
    aria-label="Loading..."
  >
    <span className="sr-only">Loading...</span>
  </div>
);

export default Spinner;
