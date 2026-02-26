import React from 'react';
import { type Entry } from '../backend';
import ToolCard from './ToolCard';
import { Skeleton } from '@/components/ui/skeleton';

interface ToolGridProps {
  entries: Entry[];
  isLoading?: boolean;
  isAdmin?: boolean;
}

const SkeletonCard: React.FC = () => (
  <div
    className="rounded-2xl p-5 flex flex-col gap-3"
    style={{
      background: 'oklch(0.17 0.008 240 / 0.6)',
      border: '1px solid oklch(1 0 0 / 0.08)',
    }}
  >
    <Skeleton className="w-12 h-12 rounded-xl" style={{ background: 'oklch(0.22 0.01 240)' }} />
    <Skeleton className="w-16 h-4 rounded-full" style={{ background: 'oklch(0.22 0.01 240)' }} />
    <Skeleton className="w-3/4 h-5 rounded" style={{ background: 'oklch(0.22 0.01 240)' }} />
    <Skeleton className="w-full h-3 rounded" style={{ background: 'oklch(0.22 0.01 240)' }} />
    <Skeleton className="w-5/6 h-3 rounded" style={{ background: 'oklch(0.22 0.01 240)' }} />
  </div>
);

const ToolGrid: React.FC<ToolGridProps> = ({ entries, isLoading = false, isAdmin = false }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 rounded-2xl"
        style={{
          background: 'oklch(0.17 0.008 240 / 0.4)',
          border: '1px solid oklch(1 0 0 / 0.06)',
        }}
      >
        <span className="text-5xl mb-4">🔍</span>
        <p
          className="font-display font-semibold text-lg mb-1"
          style={{ color: 'oklch(0.75 0.02 240)' }}
        >
          No tools found
        </p>
        <p className="text-sm" style={{ color: 'oklch(0.5 0.02 240)' }}>
          Try adjusting your search or filter
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
      {entries.map((entry, i) => (
        <div
          key={entry.id}
          className="animate-fade-in"
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          <ToolCard entry={entry} isAdmin={isAdmin} />
        </div>
      ))}
    </div>
  );
};

export default ToolGrid;
