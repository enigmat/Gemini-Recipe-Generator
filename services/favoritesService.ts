const getFavoritesKey = (userEmail: string) => `recipeAppFavorites_${userEmail}`;

export const getFavorites = (userEmail: string | null): number[] => {
  if (!userEmail) return [];
  try {
    const favoritesKey = getFavoritesKey(userEmail);
    const favorites = localStorage.getItem(favoritesKey);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error('Could not get favorites from localStorage', error);
    return [];
  }
};

export const addFavorite = (recipeId: number, userEmail: string): void => {
  const favorites = getFavorites(userEmail);
  if (!favorites.includes(recipeId)) {
    const newFavorites = [...favorites, recipeId];
    localStorage.setItem(getFavoritesKey(userEmail), JSON.stringify(newFavorites));
  }
};

export const removeFavorite = (recipeId: number, userEmail: string): void => {
  let favorites = getFavorites(userEmail);
  favorites = favorites.filter((id) => id !== recipeId);
  localStorage.setItem(getFavoritesKey(userEmail), JSON.stringify(favorites));
};

export const isFavorite = (recipeId: number, userEmail: string | null): boolean => {
  if (!userEmail) return false;
  const favorites = getFavorites(userEmail);
  return favorites.includes(recipeId);
};
