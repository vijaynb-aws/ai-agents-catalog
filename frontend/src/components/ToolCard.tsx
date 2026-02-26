import React, { useState } from 'react';
import { ExternalLink, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { type Entry, Category } from '../backend';
import { useRemoveEntry } from '../hooks/useMutations';

interface ToolCardProps {
  entry: Entry;
  featured?: boolean;
  isAdmin?: boolean;
}

const CATEGORY_LABELS: Record<Category, string> = {
  [Category.image]: 'Image',
  [Category.text]: 'Text',
  [Category.audio]: 'Audio',
  [Category.video]: 'Video',
  [Category.productivity]: 'Productivity',
};

const CATEGORY_COLORS: Record<Category, { bg: string; text: string }> = {
  [Category.image]: {
    bg: 'oklch(0.72 0.17 185 / 0.15)',
    text: 'oklch(0.72 0.17 185)',
  },
  [Category.text]: {
    bg: 'oklch(0.78 0.18 75 / 0.15)',
    text: 'oklch(0.78 0.18 75)',
  },
  [Category.audio]: {
    bg: 'oklch(0.7 0.2 140 / 0.15)',
    text: 'oklch(0.7 0.2 140)',
  },
  [Category.video]: {
    bg: 'oklch(0.65 0.15 300 / 0.15)',
    text: 'oklch(0.65 0.15 300)',
  },
  [Category.productivity]: {
    bg: 'oklch(0.75 0.18 30 / 0.15)',
    text: 'oklch(0.75 0.18 30)',
  },
};

const ToolCard: React.FC<ToolCardProps> = ({ entry, featured = false, isAdmin = false }) => {
  const catColor = CATEGORY_COLORS[entry.category] ?? CATEGORY_COLORS[Category.image];
  const [showConfirm, setShowConfirm] = useState(false);
  const [removeError, setRemoveError] = useState('');

  const removeEntry = useRemoveEntry();

  const handleClick = () => {
    window.open(entry.url, '_blank', 'noopener,noreferrer');
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRemoveError('');
    setShowConfirm(true);
  };

  const handleRemoveConfirm = () => {
    removeEntry.mutate(entry.id, {
      onSuccess: () => {
        setShowConfirm(false);
        setRemoveError('');
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to remove tool.';
        if (message.toLowerCase().includes('unauthorized')) {
          setRemoveError('You are not authorized to remove tools.');
        } else if (message.toLowerCase().includes('not exist') || message.toLowerCase().includes('not found')) {
          setRemoveError('Tool not found.');
        } else {
          setRemoveError('Failed to remove tool. Please try again.');
        }
        setShowConfirm(false);
      },
    });
  };

  return (
    <>
      <article
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={`
          group relative flex flex-col cursor-pointer rounded-2xl overflow-hidden
          transition-all duration-300 ease-out
          ${featured ? 'featured-glow' : 'glass glass-hover'}
          animate-fade-in
        `}
        style={
          featured
            ? {
                background: 'oklch(0.17 0.008 240 / 0.85)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid oklch(0.78 0.18 75 / 0.35)',
              }
            : undefined
        }
        aria-label={`Open ${entry.name}`}
      >
        {/* Featured badge */}
        {featured && (
          <div
            className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-full text-xs font-bold tracking-wide"
            style={{
              background: 'linear-gradient(135deg, oklch(0.78 0.18 75), oklch(0.72 0.17 185))',
              color: 'oklch(0.1 0.005 240)',
            }}
          >
            ★ Featured
          </div>
        )}

        {/* Admin remove button */}
        {isAdmin && (
          <button
            type="button"
            onClick={handleRemoveClick}
            disabled={removeEntry.isPending}
            className="absolute top-3 z-20 flex items-center justify-center w-7 h-7 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
            style={{
              right: featured ? '6.5rem' : '0.75rem',
              background: 'oklch(0.65 0.22 25 / 0.85)',
              color: 'oklch(0.98 0.005 240)',
              border: '1px solid oklch(0.65 0.22 25 / 0.5)',
              backdropFilter: 'blur(8px)',
            }}
            aria-label={`Remove ${entry.name}`}
          >
            {removeEntry.isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
          </button>
        )}

        {/* Card body */}
        <div className={`flex flex-col h-full p-5 ${featured ? 'p-6' : ''}`}>
          {/* Icon */}
          <div
            className={`
              flex items-center justify-center rounded-xl mb-4 transition-transform duration-300
              group-hover:scale-110
              ${featured ? 'w-16 h-16 text-4xl' : 'w-12 h-12 text-2xl'}
            `}
            style={{
              background: catColor.bg,
              border: `1px solid ${catColor.text}30`,
            }}
          >
            {entry.icon}
          </div>

          {/* Category badge */}
          <div className="mb-2">
            <span
              className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{
                background: catColor.bg,
                color: catColor.text,
                border: `1px solid ${catColor.text}40`,
              }}
            >
              {CATEGORY_LABELS[entry.category] ?? entry.category}
            </span>
          </div>

          {/* Name */}
          <h3
            className={`font-display font-bold mb-2 leading-tight transition-colors duration-200 group-hover:text-teal ${featured ? 'text-xl' : 'text-base'}`}
            style={{ color: 'oklch(0.95 0.01 240)' }}
          >
            {entry.name}
          </h3>

          {/* Description */}
          <p
            className={`font-sans leading-relaxed flex-1 ${featured ? 'text-sm' : 'text-xs'}`}
            style={{ color: 'oklch(0.65 0.02 240)' }}
          >
            {entry.description}
          </p>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <span
              className="text-xs font-medium truncate max-w-[140px]"
              style={{ color: 'oklch(0.45 0.02 240)' }}
            >
              {entry.url.replace(/^https?:\/\//, '')}
            </span>
            <ExternalLink
              className="flex-shrink-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              style={{
                width: '14px',
                height: '14px',
                color: 'oklch(0.72 0.17 185)',
              }}
            />
          </div>
        </div>

        {/* Hover shimmer line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: featured
              ? 'linear-gradient(90deg, oklch(0.78 0.18 75), oklch(0.72 0.17 185))'
              : 'linear-gradient(90deg, oklch(0.72 0.17 185), oklch(0.78 0.18 75))',
          }}
        />

        {/* Remove error toast inside card */}
        {removeError && (
          <div
            className="absolute bottom-8 left-3 right-3 z-30 px-3 py-2 rounded-lg text-xs font-medium"
            style={{
              background: 'oklch(0.65 0.22 25 / 0.9)',
              color: 'oklch(0.98 0.005 240)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {removeError}
          </div>
        )}
      </article>

      {/* Confirmation dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent
          style={{
            background: 'oklch(0.15 0.008 240 / 0.97)',
            backdropFilter: 'blur(24px)',
            border: '1px solid oklch(1 0 0 / 0.1)',
            boxShadow: '0 24px 64px oklch(0 0 0 / 0.6)',
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: 'oklch(0.95 0.01 240)' }}>
              Remove Tool
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'oklch(0.55 0.02 240)' }}>
              Are you sure you want to remove{' '}
              <span className="font-semibold" style={{ color: 'oklch(0.78 0.18 75)' }}>
                {entry.name}
              </span>
              ? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              style={{
                background: 'oklch(0.18 0.01 240)',
                borderColor: 'oklch(1 0 0 / 0.1)',
                color: 'oklch(0.75 0.02 240)',
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveConfirm}
              disabled={removeEntry.isPending}
              style={{
                background: 'oklch(0.65 0.22 25)',
                color: 'oklch(0.98 0.005 240)',
              }}
            >
              {removeEntry.isPending ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Removing…
                </span>
              ) : (
                'Remove'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ToolCard;
