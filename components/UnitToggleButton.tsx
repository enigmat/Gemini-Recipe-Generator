import React from 'react';

interface UnitToggleButtonProps {
  system: 'metric' | 'us';
  onSystemChange: (system: 'metric' | 'us') => void;
}

const UnitToggleButton: React.FC<UnitToggleButtonProps> = ({ system, onSystemChange }) => {
  const baseClasses = "px-4 py-1.5 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500";
  const activeClasses = "bg-amber-500 text-white";
  const inactiveClasses = "bg-transparent text-amber-800 hover:bg-amber-200/50";

  return (
    <div className="flex rounded-lg p-0.5 bg-amber-100/70">
      <button
        onClick={() => onSystemChange('metric')}
        className={`${baseClasses} rounded-md ${system === 'metric' ? activeClasses : inactiveClasses}`}
        aria-pressed={system === 'metric'}
      >
        Metric (°C)
      </button>
      <button
        onClick={() => onSystemChange('us')}
        className={`${baseClasses} rounded-md ${system === 'us' ? activeClasses : inactiveClasses}`}
        aria-pressed={system === 'us'}
      >
        US (°F)
      </button>
    </div>
  );
};

export default UnitToggleButton;