import React, { useState } from 'react';
import { Plus, Loader2, Tag, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetCategories } from '../hooks/useQueries';
import { useAddCategory, useRemoveCategory } from '../hooks/useMutations';

interface ManageCategoriesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEFAULT_CATEGORIES = ['image', 'text', 'audio', 'video', 'productivity'];

const ManageCategoriesModal: React.FC<ManageCategoriesModalProps> = ({ open, onOpenChange }) => {
  const [newCategory, setNewCategory] = useState('');
  const [inputError, setInputError] = useState('');
  const [removeError, setRemoveError] = useState('');
  const [categoryToRemove, setCategoryToRemove] = useState<string | null>(null);

  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategories();
  const addCategory = useAddCategory();
  const removeCategory = useRemoveCategory();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim();

    if (!trimmed) {
      setInputError('Category name cannot be empty.');
      return;
    }

    const isDuplicate = categories.some(
      (cat) => cat.toLowerCase() === trimmed.toLowerCase()
    );
    if (isDuplicate) {
      setInputError('This category already exists.');
      return;
    }

    setInputError('');
    addCategory.mutate(trimmed, {
      onSuccess: () => {
        setNewCategory('');
        setInputError('');
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to add category.';
        if (message.toLowerCase().includes('unauthorized')) {
          setInputError('You are not authorized to add categories.');
        } else if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('already')) {
          setInputError('This category already exists.');
        } else {
          setInputError('Failed to add category. Please try again.');
        }
      },
    });
  };

  const handleRemoveConfirm = () => {
    if (!categoryToRemove) return;
    setRemoveError('');
    removeCategory.mutate(categoryToRemove, {
      onSuccess: () => {
        setCategoryToRemove(null);
        setRemoveError('');
      },
      onError: (err: unknown) => {
        const message = err instanceof Error ? err.message : 'Failed to remove category.';
        if (message.toLowerCase().includes('unauthorized')) {
          setRemoveError('You are not authorized to remove categories.');
        } else if (message.toLowerCase().includes('default')) {
          setRemoveError('Default categories cannot be removed.');
        } else if (message.toLowerCase().includes('not exist')) {
          setRemoveError('Category does not exist.');
        } else {
          setRemoveError('Failed to remove category. Please try again.');
        }
        setCategoryToRemove(null);
      },
    });
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen && !addCategory.isPending && !removeCategory.isPending) {
      setNewCategory('');
      setInputError('');
      setRemoveError('');
    }
    onOpenChange(nextOpen);
  };

  const isDefaultCategory = (name: string) =>
    DEFAULT_CATEGORIES.includes(name.toLowerCase());

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent
          className="max-w-md w-full border"
          style={{
            background: 'oklch(0.15 0.008 240 / 0.97)',
            backdropFilter: 'blur(24px)',
            borderColor: 'oklch(1 0 0 / 0.1)',
            boxShadow: '0 24px 64px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.72 0.17 185 / 0.12)',
          }}
        >
          <DialogHeader>
            <DialogTitle
              className="font-display text-xl font-bold tracking-tight flex items-center gap-2"
              style={{ color: 'oklch(0.95 0.01 240)' }}
            >
              <Tag className="w-5 h-5" style={{ color: 'oklch(0.72 0.17 185)' }} />
              Manage Categories
            </DialogTitle>
            <DialogDescription style={{ color: 'oklch(0.55 0.02 240)' }}>
              View, add, or remove categories in the catalog.
            </DialogDescription>
          </DialogHeader>

          {/* Existing categories list */}
          <div className="mt-2">
            <p
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: 'oklch(0.55 0.02 240)' }}
            >
              Current Categories
            </p>

            {isLoadingCategories ? (
              <div className="flex items-center gap-2 py-4" style={{ color: 'oklch(0.55 0.02 240)' }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Loading categories…</span>
              </div>
            ) : categories.length === 0 ? (
              <p className="text-sm py-3" style={{ color: 'oklch(0.45 0.02 240)' }}>
                No categories yet.
              </p>
            ) : (
              <div className="flex flex-col gap-2 mb-4 max-h-52 overflow-y-auto pr-1">
                {categories.map((cat) => {
                  const isDefault = isDefaultCategory(cat);
                  const isRemoving = removeCategory.isPending && categoryToRemove === cat;
                  return (
                    <div
                      key={cat}
                      className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl"
                      style={{
                        background: 'oklch(0.18 0.01 240)',
                        border: '1px solid oklch(0.72 0.17 185 / 0.2)',
                      }}
                    >
                      <span
                        className="flex items-center gap-1.5 text-sm font-medium capitalize"
                        style={{ color: 'oklch(0.72 0.17 185)' }}
                      >
                        <Tag className="w-3 h-3 shrink-0" />
                        {cat}
                      </span>
                      <div className="flex items-center gap-2">
                        {isDefault && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{
                              background: 'oklch(0.72 0.17 185 / 0.1)',
                              color: 'oklch(0.55 0.02 240)',
                            }}
                          >
                            default
                          </span>
                        )}
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => setCategoryToRemove(cat)}
                            disabled={removeCategory.isPending}
                            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                            style={{
                              background: 'oklch(0.65 0.22 25 / 0.12)',
                              color: 'oklch(0.65 0.22 25)',
                              border: '1px solid oklch(0.65 0.22 25 / 0.25)',
                            }}
                            aria-label={`Remove category ${cat}`}
                          >
                            {isRemoving ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {removeError && (
              <p className="text-xs mb-3" style={{ color: 'oklch(0.65 0.22 25)' }}>
                {removeError}
              </p>
            )}
          </div>

          {/* Divider */}
          <div
            className="h-px my-1"
            style={{ background: 'oklch(1 0 0 / 0.07)' }}
          />

          {/* Add new category form */}
          <form onSubmit={handleAdd} className="space-y-3 mt-2">
            <div className="space-y-1.5">
              <Label
                htmlFor="new-category"
                className="text-sm font-semibold"
                style={{ color: 'oklch(0.8 0.02 240)' }}
              >
                New Category Name
              </Label>
              <div className="flex gap-2">
                <Input
                  id="new-category"
                  placeholder="e.g. Design"
                  value={newCategory}
                  onChange={(e) => {
                    setNewCategory(e.target.value);
                    if (inputError) setInputError('');
                  }}
                  disabled={addCategory.isPending}
                  className="border flex-1"
                  style={{
                    background: 'oklch(0.12 0.005 240)',
                    borderColor: inputError ? 'oklch(0.65 0.22 25)' : 'oklch(1 0 0 / 0.1)',
                    color: 'oklch(0.95 0.01 240)',
                  }}
                />
                <button
                  type="submit"
                  disabled={addCategory.isPending || !newCategory.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, oklch(0.72 0.17 185), oklch(0.68 0.16 185))',
                    color: 'oklch(0.1 0.005 240)',
                    boxShadow: '0 0 16px oklch(0.72 0.17 185 / 0.25)',
                  }}
                >
                  {addCategory.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                  Add
                </button>
              </div>
              {inputError && (
                <p className="text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>
                  {inputError}
                </p>
              )}
              {addCategory.isSuccess && !inputError && (
                <p className="text-xs" style={{ color: 'oklch(0.72 0.17 185)' }}>
                  Category added successfully!
                </p>
              )}
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for category removal */}
      <AlertDialog
        open={!!categoryToRemove}
        onOpenChange={(open) => {
          if (!open) setCategoryToRemove(null);
        }}
      >
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
              Remove Category
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: 'oklch(0.55 0.02 240)' }}>
              Are you sure you want to remove the{' '}
              <span className="font-semibold capitalize" style={{ color: 'oklch(0.78 0.18 75)' }}>
                {categoryToRemove}
              </span>{' '}
              category? This action cannot be undone.
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
              style={{
                background: 'oklch(0.65 0.22 25)',
                color: 'oklch(0.98 0.005 240)',
              }}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ManageCategoriesModal;
