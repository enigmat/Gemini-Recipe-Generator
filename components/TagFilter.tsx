import React from 'react';

interface TagFilterProps {
  tags: string[];
  selectedTag: string;
  onSelectTag: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelectTag }) => {
  const allTags = ['All', ...tags];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8">
      {allTags.map((tag) => (
        <button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
            selectedTag === tag
              ? 'bg-amber-500 text-white shadow-sm'
              : 'bg-white text-gray-700 hover:bg-amber-100 shadow-sm border border-gray-200'
          }`}
          aria-pressed={selectedTag === tag}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter;