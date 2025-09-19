import { useLocalStorage } from "../hooks/useLocalStorage";

export default function useFavorites() {
  const [favs, setFavs] = useLocalStorage<{ id: string; name: string }[]>(
    "favorites",
    [],
  );
  const toggleFav = (id: string, name: string) => {
    setFavs((prev) =>
      prev.some((f) => f.id === id)
        ? prev.filter((f) => f.id !== id)
        : [...prev, { id, name }],
    );
  };
  return { favs, toggleFav };
}
