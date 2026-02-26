# Specification

## Summary
**Goal:** Restore missing catalog data and the Featured Tools section so the AI hub catalog page displays all tools and categories correctly.

**Planned changes:**
- Fix backend actor query methods (all entries, featured entries, categories) to return populated data instead of empty results
- Ensure `FeaturedSection` component is rendered in `CatalogPage.tsx` between `HeroBanner` and `SearchInput`, and displays featured entries when they exist
- Wire `useQueries` hooks for entries, featured entries, and categories correctly to the backend actor so data propagates to `CatalogPage`, `FeaturedSection`, `FilterBar`, and `ToolGrid`

**User-visible outcome:** The catalog page shows all AI tool entries in the grid, the Featured Tools section appears between the hero banner and search input, and category filters reflect live data from the backend.
