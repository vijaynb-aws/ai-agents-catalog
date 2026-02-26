import React from 'react';
import { Category } from '../backend';

export type FilterCategory = 'all' | Category;

interface FilterBarProps {
  activeFilter: FilterCategory;
  onFilterChange: (filter: FilterCategory) => void;
  counts: Record<FilterCategory, number>;
}

const FILTERS: { label: string; value: FilterCategory; emoji: string }[] = [
  { label: 'All', value: 'all', emoji: '✨' },
  { label: 'Image', value: Category.image, emoji: '🖼️' },
  { label: 'Text', value: Category.text, emoji: '✍️' },
  { label: 'Audio', value: Category.audio, emoji: '🎧' },
  { label: 'Video', value: Category.video, emoji: '🎬' },
  { label: 'Productivity', value: Category.productivity, emoji: '🧑‍💻' },
];

const FilterBar: React.FC<FilterBarProps> = ({ activeFilter, onFilterChange, counts }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.value;
        const count = counts[filter.value] ?? 0;

        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 select-none"
            style={
              isActive
                ? {
                    background:
                      filter.value === 'all'
                        ? 'linear-gradient(135deg, oklch(0.72 0.17 185), oklch(0.78 0.18 75))'
                        : 'oklch(0.72 0.17 185)',
                    color: 'oklch(0.1 0.005 240)',
                    boxShadow: '0 0 16px oklch(0.72 0.17 185 / 0.35)',
                    border: '1px solid transparent',
                  }
                : {
                    background: 'oklch(0.17 0.008 240 / 0.7)',
                    color: 'oklch(0.75 0.02 240)',
                    border: '1px solid oklch(1 0 0 / 0.1)',
                  }
            }
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'oklch(0.72 0.17 185 / 0.4)';
                e.currentTarget.style.color = 'oklch(0.95 0.01 240)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'oklch(1 0 0 / 0.1)';
                e.currentTarget.style.color = 'oklch(0.75 0.02 240)';
              }
            }}
          >
            <span>{filter.emoji}</span>
            <span>{filter.label}</span>
            {count > 0 && (
              <span
                className="ml-0.5 px-1.5 py-0.5 rounded-full text-xs font-bold"
                style={{
                  background: isActive
                    ? 'oklch(0.1 0.005 240 / 0.3)'
                    : 'oklch(1 0 0 / 0.08)',
                  color: isActive ? 'oklch(0.1 0.005 240)' : 'oklch(0.55 0.02 240)',
                }}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;
