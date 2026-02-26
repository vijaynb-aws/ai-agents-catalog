import React, { useState } from 'react';
import { Plus, Loader2, ExternalLink } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Category } from '../backend';
import { useAddEntry } from '../hooks/useMutations';
import { useGetCategories } from '../hooks/useQueries';

interface AddToolModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  name: string;
  description: string;
  category: string;
  icon: string;
  url: string;
  featured: boolean;
}

interface FormErrors {
  name?: string;
  description?: string;
  category?: string;
  icon?: string;
  url?: string;
}

const INITIAL_FORM: FormState = {
  name: '',
  description: '',
  category: '',
  icon: '',
  url: '',
  featured: false,
};

// Map category string to Category enum value
const toCategoryEnum = (value: string): Category | undefined => {
  const map: Record<string, Category> = {
    image: Category.image,
    text: Category.text,
    audio: Category.audio,
    video: Category.video,
    productivity: Category.productivity,
  };
  return map[value.toLowerCase()];
};

// Emoji map for known categories
const CATEGORY_EMOJI: Record<string, string> = {
  image: '🖼️',
  text: '✍️',
  audio: '🎧',
  video: '🎬',
  productivity: '🧑‍💻',
};

const AddToolModal: React.FC<AddToolModalProps> = ({ open, onOpenChange }) => {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const addEntry = useAddEntry();
  const { data: categories = [], isLoading: isLoadingCategories } = useGetCategories();

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) newErrors.name = 'Name is required.';
    if (!form.description.trim()) newErrors.description = 'Description is required.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (!form.icon.trim()) newErrors.icon = 'Icon or emoji is required.';
    if (!form.url.trim()) {
      newErrors.url = 'URL is required.';
    } else {
      try {
        new URL(form.url.trim());
      } catch {
        newErrors.url = 'Please enter a valid URL (e.g. https://example.com).';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const categoryEnum = toCategoryEnum(form.category);
    if (!categoryEnum) {
      setErrors((prev) => ({ ...prev, category: 'Invalid category selected.' }));
      return;
    }

    addEntry.mutate(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        category: categoryEnum,
        icon: form.icon.trim(),
        url: form.url.trim(),
        featured: form.featured,
      },
      {
        onSuccess: () => {
          setForm(INITIAL_FORM);
          setErrors({});
          onOpenChange(false);
        },
      }
    );
  };

  const handleClose = (nextOpen: boolean) => {
    if (!nextOpen && !addEntry.isPending) {
      setForm(INITIAL_FORM);
      setErrors({});
    }
    onOpenChange(nextOpen);
  };

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        className="max-w-lg w-full border"
        style={{
          background: 'oklch(0.15 0.008 240 / 0.97)',
          backdropFilter: 'blur(24px)',
          borderColor: 'oklch(1 0 0 / 0.1)',
          boxShadow: '0 24px 64px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.72 0.17 185 / 0.12)',
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="font-display text-xl font-bold tracking-tight"
            style={{ color: 'oklch(0.95 0.01 240)' }}
          >
            Add New AI Tool
          </DialogTitle>
          <DialogDescription style={{ color: 'oklch(0.55 0.02 240)' }}>
            Submit a new tool to the catalog. All fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label
              htmlFor="tool-name"
              className="text-sm font-semibold"
              style={{ color: 'oklch(0.8 0.02 240)' }}
            >
              Name *
            </Label>
            <Input
              id="tool-name"
              placeholder="e.g. PhotoMagic"
              value={form.name}
              onChange={(e) => setField('name', e.target.value)}
              disabled={addEntry.isPending}
              className="border"
              style={{
                background: 'oklch(0.12 0.005 240)',
                borderColor: errors.name ? 'oklch(0.65 0.22 25)' : 'oklch(1 0 0 / 0.1)',
                color: 'oklch(0.95 0.01 240)',
              }}
            />
            {errors.name && (
              <p className="text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label
              htmlFor="tool-description"
              className="text-sm font-semibold"
              style={{ color: 'oklch(0.8 0.02 240)' }}
            >
              Description *
            </Label>
            <Textarea
              id="tool-description"
              placeholder="Briefly describe what this tool does..."
              value={form.description}
              onChange={(e) => setField('description', e.target.value)}
              disabled={addEntry.isPending}
              rows={3}
              className="resize-none border"
              style={{
                background: 'oklch(0.12 0.005 240)',
                borderColor: errors.description ? 'oklch(0.65 0.22 25)' : 'oklch(1 0 0 / 0.1)',
                color: 'oklch(0.95 0.01 240)',
              }}
            />
            {errors.description && (
              <p className="text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>
                {errors.description}
              </p>
            )}
          </div>

          {/* Category + Icon row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <Label
                className="text-sm font-semibold"
                style={{ color: 'oklch(0.8 0.02 240)' }}
              >
                Category *
              </Label>
              <Select
                value={form.category}
                onValueChange={(val) => setField('category', val)}
                disabled={addEntry.isPending || isLoadingCategories}
              >
                <SelectTrigger
                  className="border"
                  style={{
                    background: 'oklch(0.12 0.005 240)',
                    borderColor: errors.category ? 'oklch(0.65 0.22 25)' : 'oklch(1 0 0 / 0.1)',
                    color: form.category ? 'oklch(0.95 0.01 240)' : 'oklch(0.45 0.02 240)',
                  }}
                >
                  <SelectValue placeholder={isLoadingCategories ? 'Loading…' : 'Select…'} />
                </SelectTrigger>
                <SelectContent
                  style={{
                    background: 'oklch(0.15 0.008 240)',
                    borderColor: 'oklch(1 0 0 / 0.12)',
                  }}
                >
                  {categories.map((cat) => {
                    const emoji = CATEGORY_EMOJI[cat.toLowerCase()] ?? '🏷️';
                    const label = cat.charAt(0).toUpperCase() + cat.slice(1);
                    return (
                      <SelectItem
                        key={cat}
                        value={cat}
                        style={{ color: 'oklch(0.9 0.01 240)' }}
                      >
                        {emoji} {label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>
                  {errors.category}
                </p>
              )}
            </div>

            {/* Icon */}
            <div className="space-y-1.5">
              <Label
                htmlFor="tool-icon"
                className="text-sm font-semibold"
                style={{ color: 'oklch(0.8 0.02 240)' }}
              >
                Icon / Emoji *
              </Label>
              <Input
                id="tool-icon"
                placeholder="e.g. 🎨"
                value={form.icon}
                onChange={(e) => setField('icon', e.target.value)}
                disabled={addEntry.isPending}
                className="border text-center text-lg"
                style={{
                  background: 'oklch(0.12 0.005 240)',
                  borderColor: errors.icon ? 'oklch(0.65 0.22 25)' : 'oklch(1 0 0 / 0.1)',
                  color: 'oklch(0.95 0.01 240)',
                }}
              />
              {errors.icon && (
                <p className="text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>
                  {errors.icon}
                </p>
              )}
            </div>
          </div>

          {/* URL */}
          <div className="space-y-1.5">
            <Label
              htmlFor="tool-url"
              className="text-sm font-semibold flex items-center gap-1.5"
              style={{ color: 'oklch(0.8 0.02 240)' }}
            >
              <ExternalLink className="w-3.5 h-3.5" />
              URL *
            </Label>
            <Input
              id="tool-url"
              type="url"
              placeholder="https://example.com"
              value={form.url}
              onChange={(e) => setField('url', e.target.value)}
              disabled={addEntry.isPending}
              className="border"
              style={{
                background: 'oklch(0.12 0.005 240)',
                borderColor: errors.url ? 'oklch(0.65 0.22 25)' : 'oklch(1 0 0 / 0.1)',
                color: 'oklch(0.95 0.01 240)',
              }}
            />
            {errors.url && (
              <p className="text-xs" style={{ color: 'oklch(0.65 0.22 25)' }}>
                {errors.url}
              </p>
            )}
          </div>

          {/* Featured toggle */}
          <div
            className="flex items-center justify-between px-4 py-3 rounded-xl border"
            style={{
              background: 'oklch(0.12 0.005 240)',
              borderColor: 'oklch(1 0 0 / 0.08)',
            }}
          >
            <div>
              <p className="text-sm font-semibold" style={{ color: 'oklch(0.85 0.02 240)' }}>
                Featured Tool
              </p>
              <p className="text-xs mt-0.5" style={{ color: 'oklch(0.5 0.02 240)' }}>
                Highlight this tool in the featured section
              </p>
            </div>
            <Switch
              checked={form.featured}
              onCheckedChange={(val) => setField('featured', val)}
              disabled={addEntry.isPending}
            />
          </div>

          <DialogFooter className="pt-2 gap-2">
            <button
              type="button"
              onClick={() => handleClose(false)}
              disabled={addEntry.isPending}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-50"
              style={{
                background: 'oklch(0.18 0.01 240)',
                color: 'oklch(0.75 0.02 240)',
                border: '1px solid oklch(1 0 0 / 0.1)',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addEntry.isPending}
              className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, oklch(0.72 0.17 185), oklch(0.68 0.16 185))',
                color: 'oklch(0.1 0.005 240)',
                boxShadow: '0 0 20px oklch(0.72 0.17 185 / 0.3)',
              }}
            >
              {addEntry.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Tool
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddToolModal;
