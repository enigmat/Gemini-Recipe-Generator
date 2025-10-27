import React from 'react';

interface CookbookTagFilterProps {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const CookbookTagFilter: React.FC<CookbookTagFilterProps> = ({ tags, selectedTag, onSelectTag }) => {
  const allTags = ['All', ...tags];

  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Filter by Tag:</h3>
      <div className="flex flex-wrap gap-2">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectTag(tag)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 border ${
              selectedTag === tag
                ? 'bg-gray-800 text-white border-gray-800'
                : 'bg-white text-gray-600 hover:bg-gray-100 border-gray-300'
            }`}
            aria-pressed={selectedTag === tag}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CookbookTagFilter;
