import React from 'react';
import { Sparkles } from 'lucide-react';
import { type Entry } from '../backend';
import ToolCard from './ToolCard';

interface FeaturedSectionProps {
  entries: Entry[];
  isAdmin?: boolean;
}

const FeaturedSection: React.FC<FeaturedSectionProps> = ({ entries, isAdmin = false }) => {
  if (entries.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center gap-2 mb-5">
        <Sparkles
          style={{ width: '20px', height: '20px', color: 'oklch(0.78 0.18 75)' }}
        />
        <h2
          className="font-display font-bold text-xl tracking-tight"
          style={{ color: 'oklch(0.95 0.01 240)' }}
        >
          Featured Tools
        </h2>
        <div
          className="flex-1 h-px ml-2"
          style={{
            background:
              'linear-gradient(90deg, oklch(0.78 0.18 75 / 0.4), transparent)',
          }}
        />
      </div>

      {/* Featured grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry, i) => (
          <div
            key={entry.id}
            className="animate-fade-in"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <ToolCard entry={entry} featured isAdmin={isAdmin} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;
