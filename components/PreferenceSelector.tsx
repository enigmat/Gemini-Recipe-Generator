import React from 'react';

export const CUISINE_OPTIONS = [
    'American', 'Italian', 'Mexican', 'Indian', 'French', 
    'Japanese', 'Thai', 'Chinese', 'Vietnamese', 'Healthy', 'Vegan'
];

interface PreferenceSelectorProps {
  selectedPreferences: string[];
  onChange: (newPreferences: string[]) => void;
  limit: number;
}

const PreferenceSelector: React.FC<PreferenceSelectorProps> = ({ selectedPreferences, onChange, limit }) => {
  const handlePreferenceChange = (preference: string) => {
    const isSelected = selectedPreferences.includes(preference);
    let newPreferences: string[];

    if (isSelected) {
      newPreferences = selectedPreferences.filter(p => p !== preference);
    } else {
      if (selectedPreferences.length < limit) {
        newPreferences = [...selectedPreferences, preference];
      } else {
        // Limit reached, do nothing. The UI indicates this.
        return;
      }
    }
    onChange(newPreferences);
  };

  return (
    <div className="my-4">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">Choose Your Favorite Cuisines</h3>
      <p className="text-sm text-slate-500 mb-4">Select up to {limit} to personalize your recommendations.</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CUISINE_OPTIONS.map(cuisine => {
          const isSelected = selectedPreferences.includes(cuisine);
          const isLimitReached = selectedPreferences.length >= limit && !isSelected;
          return (
            <label
              key={cuisine}
              className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all text-center ${
                isSelected ? 'bg-teal-500 border-teal-500 text-white font-semibold' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              } ${isLimitReached ? 'cursor-not-allowed opacity-60' : ''}`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handlePreferenceChange(cuisine)}
                disabled={isLimitReached}
                className="hidden"
              />
              <span className="text-sm">{cuisine}</span>
            </label>
          );
        })}
      </div>
      <p className="text-xs text-slate-500 mt-2 text-right font-medium">{selectedPreferences.length} / {limit} selected</p>
    </div>
  );
};

export default PreferenceSelector;
