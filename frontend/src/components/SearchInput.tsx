import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search AI tools...',
}) => {
  return (
    <div className="relative w-full max-w-md">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ width: '16px', height: '16px', color: 'oklch(0.72 0.17 185)' }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2.5 rounded-xl font-sans text-sm transition-all duration-200 outline-none"
        style={{
          background: 'oklch(0.17 0.008 240 / 0.8)',
          border: '1px solid oklch(1 0 0 / 0.1)',
          color: 'oklch(0.95 0.01 240)',
          backdropFilter: 'blur(8px)',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'oklch(0.72 0.17 185 / 0.6)';
          e.currentTarget.style.boxShadow = '0 0 0 3px oklch(0.72 0.17 185 / 0.1)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'oklch(1 0 0 / 0.1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 transition-colors"
          style={{ color: 'oklch(0.55 0.02 240)' }}
          aria-label="Clear search"
        >
          <X style={{ width: '14px', height: '14px' }} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
