import React from 'react';

interface TagFilterProps {
  allTags: string[];
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ allTags, selectedTags, onTagClick }) => {
  return (
    <div>
        <h3 className="text-sm font-semibold text-text-secondary mb-2">Filter by Tag:</h3>
        <div className="flex flex-wrap gap-2">
            {allTags.map(tag => {
                const isSelected = selectedTags.includes(tag);
                return (
                    <button
                        key={tag}
                        onClick={() => onTagClick(tag)}
                        className={`px-3 py-1.5 text-sm font-medium rounded-full border-2 transition-colors duration-200 ${
                            isSelected
                                ? 'bg-primary border-primary text-white'
                                : 'bg-white border-border-color text-text-secondary hover:bg-gray-100 hover:border-gray-400'
                        }`}
                        aria-pressed={isSelected}
                    >
                        {tag}
                    </button>
                );
            })}
        </div>
    </div>
  );
};

export default TagFilter;
