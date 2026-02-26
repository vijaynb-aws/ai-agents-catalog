import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { Entry, Category } from '../backend';

export function useGetAllEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<Entry[]>({
    queryKey: ['entries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getAllEntries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 2,
  });
}

export function useGetFeaturedEntries() {
  const { actor, isFetching } = useActor();

  return useQuery<Entry[]>({
    queryKey: ['featuredEntries'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getFeaturedEntries();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 2,
  });
}

export function useGetEntriesByCategory(category: Category) {
  const { actor, isFetching } = useActor();

  return useQuery<Entry[]>({
    queryKey: ['entriesByCategory', category],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getEntriesByCategory(category);
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 2,
  });
}

export function useIsAdmin() {
  const { actor, isFetching: actorFetching } = useActor();
  const { identity, isInitializing } = useInternetIdentity();

  const principal = identity?.getPrincipal().toString() ?? 'anonymous';
  const isAuthenticated = !!identity;

  const query = useQuery<boolean>({
    // Include principal in query key so it re-runs on login/logout
    queryKey: ['isAdmin', principal],
    queryFn: async () => {
      // Not authenticated → definitely not admin
      if (!isAuthenticated || !actor) return false;
      // Call the backend isAdmin method directly
      const result = await actor.isAdmin();
      return result;
    },
    // Only run when actor is ready, identity is resolved, and user is authenticated
    enabled: !!actor && !actorFetching && !isInitializing && isAuthenticated,
    staleTime: 0,
    gcTime: 30_000,
    retry: 1,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });

  return {
    ...query,
    isLoading: actorFetching || isInitializing || query.isLoading,
    isFetching: actorFetching || isInitializing || query.isFetching,
    // isFetched should only be true when the query actually ran (user is authenticated)
    isFetched: isAuthenticated ? query.isFetched : true,
  };
}

export function useGetCategories() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCategories();
    },
    enabled: !!actor && !isFetching,
    staleTime: 0,
    retry: 2,
  });
}
