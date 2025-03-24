// src/store/favorites-store.ts
import { create } from 'zustand';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Types
export interface Favorites {
  [categoryId: string]: string[];
}

interface FavoritesState {
  favorites: Favorites;
  setFavorites: (favorites: Favorites) => void;
  isFavorite: (actionId: string, categoryId: string) => boolean;
}

// API Functions
const fetchFavorites = async (): Promise<Favorites> => {
  const response = await fetch('/api/favorites');
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return result.data || {};
};

const updateFavorite = async ({
  actionId,
  categoryId,
  isFavorite,
}: {
  actionId: string;
  categoryId: string;
  isFavorite: boolean;
}): Promise<Favorites> => {
  const response = await fetch('/api/favorites', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actionId, categoryId, isFavorite }),
  });
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error);
  }
  
  return result.data;
};

// Zustand Store
export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: {},
  setFavorites: (favorites) => set({ favorites }),
  isFavorite: (actionId, categoryId) => {
    const categoryFavorites = get().favorites[categoryId] || [];
    return categoryFavorites.includes(actionId);
  },
}));

// React Query Hooks
export const useFavorites = () => {
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  
  return useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    // Using the newer onSuccess approach in React Query v5

    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  
  return useMutation({
    mutationFn: updateFavorite,
    onSuccess: (data) => {
      setFavorites(data);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};