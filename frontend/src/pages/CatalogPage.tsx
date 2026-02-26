import React, { useState, useMemo } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useIsAdmin, useGetAllEntries, useGetFeaturedEntries } from '../hooks/useQueries';
import { Category, type Entry } from '../backend';
import HeroBanner from '../components/HeroBanner';
import SearchInput from '../components/SearchInput';
import FilterBar, { type FilterCategory } from '../components/FilterBar';
import FeaturedSection from '../components/FeaturedSection';
import ToolGrid from '../components/ToolGrid';
import AddToolModal from '../components/AddToolModal';
import ManageCategoriesModal from '../components/ManageCategoriesModal';
import { PlusCircle, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function CatalogPage() {
  const { identity, isInitializing } = useInternetIdentity();
  const {
    data: isAdmin,
    isLoading: isAdminLoading,
    isFetching: isAdminFetching,
    isFetched: isAdminFetched,
  } = useIsAdmin();
  const { data: allEntries = [], isLoading: entriesLoading } = useGetAllEntries();
  const { data: featuredEntries = [], isLoading: featuredLoading } = useGetFeaturedEntries();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [addToolOpen, setAddToolOpen] = useState(false);
  const [manageCatsOpen, setManageCatsOpen] = useState(false);

  const isAuthenticated = !!identity;

  // Filtered entries based on category + search — uses ALL entries
  const filteredEntries = useMemo(() => {
    let entries: Entry[] = allEntries;

    if (activeFilter !== 'all') {
      entries = entries.filter((e) => e.category === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      entries = entries.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return entries;
  }, [allEntries, activeFilter, searchQuery]);

  // Counts per category for filter badges — based on ALL entries
  const counts = useMemo<Record<FilterCategory, number>>(() => {
    return {
      all: allEntries.length,
      [Category.image]: allEntries.filter((e) => e.category === Category.image).length,
      [Category.text]: allEntries.filter((e) => e.category === Category.text).length,
      [Category.audio]: allEntries.filter((e) => e.category === Category.audio).length,
      [Category.video]: allEntries.filter((e) => e.category === Category.video).length,
      [Category.productivity]: allEntries.filter((e) => e.category === Category.productivity).length,
    };
  }, [allEntries]);

  // Admin check is still in progress
  const adminCheckPending = isInitializing || isAdminLoading || isAdminFetching;

  // Show admin controls only when:
  // 1. User is authenticated
  // 2. Admin check has completed (fetched at least once)
  // 3. isAdmin is true
  const showAdminControls = isAuthenticated && isAdminFetched && !!isAdmin;

  const isGridLoading = entriesLoading;

  return (
    <main className="min-h-screen bg-background">
      <HeroBanner />

      {/* Featured Section — directly below the hero banner */}
      {(featuredEntries.length > 0 || featuredLoading) && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <FeaturedSection entries={featuredEntries} isAdmin={showAdminControls} />
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Admin Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
          <div className="flex-1 max-w-xl">
            <SearchInput value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Show spinner while checking admin status for authenticated users */}
          {isAuthenticated && adminCheckPending && (
            <div className="flex items-center gap-2 text-sm" style={{ color: 'oklch(0.72 0.17 185 / 0.6)' }}>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking access…</span>
            </div>
          )}

          {showAdminControls && (
            <div className="flex gap-3">
              <Button
                onClick={() => setManageCatsOpen(true)}
                variant="outline"
                className="border-teal-500/50 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Categories
              </Button>
              <Button
                onClick={() => setAddToolOpen(true)}
                className="bg-teal-500 hover:bg-teal-400 text-background font-semibold"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Tool
              </Button>
            </div>
          )}
        </div>

        {/* Filter Bar */}
        <div className="mb-6 overflow-x-auto scrollbar-thin pb-1">
          <FilterBar
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            counts={counts}
          />
        </div>

        {/* Tool Grid */}
        <ToolGrid
          entries={filteredEntries}
          isLoading={isGridLoading}
          isAdmin={showAdminControls}
        />
      </section>

      {/* Modals */}
      <AddToolModal
        open={addToolOpen}
        onOpenChange={setAddToolOpen}
      />
      <ManageCategoriesModal
        open={manageCatsOpen}
        onOpenChange={setManageCatsOpen}
      />
    </main>
  );
}
