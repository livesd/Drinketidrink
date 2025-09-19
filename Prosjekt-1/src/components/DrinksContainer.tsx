import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import FilterBar from "./FilterBar";
import Card from "./card";
import FavoritesSheet from "./FavoritesSheet";
import { useLocalStorage } from "../hooks/useLocalStorage";
import "./FavoritesSheet.css";

import {
  searchByName,
  filterByAlcoholic,
  lookupById,
  getInitialDeck,
  toLite,
  type Drink,
  type DrinkLite,
} from "../api/cocktails";

const norm = (s: string | null | undefined) =>
  (s ?? "").toLowerCase().replace(/[_\s]+/g, "");

const fromLite = (l: DrinkLite): Drink => ({
  ...l,
  strCategory: null,
  strAlcoholic: null,
  strGlass: null,
  strInstructions: null,
});

export default function CocktailBrowser() {
  const [filters, setFilters] = useState({ qName: "", alc: "" });
  const usingFilters = Boolean(filters.qName.trim() || filters.alc.trim());

  const listQ = useQuery({
    queryKey: usingFilters
      ? ["drinks-lite", "filters", filters.qName, filters.alc]
      : ["drinks-lite", "initial"],
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData, // keep previous list while searching
    queryFn: async (): Promise<DrinkLite[]> => {
      if (filters.qName.trim()) {
        const byName = await searchByName(filters.qName);
        const narrowed = filters.alc
          ? byName.filter((d) => norm(d.strAlcoholic) === norm(filters.alc))
          : byName;
        return narrowed.map(toLite);
      }
      if (filters.alc.trim()) {
        return filterByAlcoholic(filters.alc);
      }
      const deck = await getInitialDeck();
      return deck.map(toLite);
    },
  });

  const items = listQ.data ?? [];
  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [items.length]);

  const hasResults = items.length > 0;
  const currentLite = hasResults ? items[index] : null;

  const detailQ = useQuery({
    queryKey: ["drink-detail", currentLite?.idDrink],
    enabled: !!currentLite,
    staleTime: 10 * 60 * 1000,
    placeholderData: keepPreviousData, // keep last detail while switching
    queryFn: async () => (currentLite ? lookupById(currentLite.idDrink) : null),
  });

  const currentDrink: Drink | null = currentLite
    ? (detailQ.data ?? fromLite(currentLite))
    : null;

  const next = useCallback(
    () => hasResults && setIndex((i) => Math.min(i + 1, items.length - 1)),
    [hasResults, items.length],
  );
  const prev = useCallback(
    () => hasResults && setIndex((i) => Math.max(i - 1, 0)),
    [hasResults],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Persistent favorites
  const [favs, toggleFav] = useLocalStorage<{ id: string; name: string }[]>(
    "favorites",
    [],
  );

  const jumpTo = useCallback(
    (id: string) => {
      const i = items.findIndex((d) => d.idDrink === id);
      if (i >= 0) setIndex(i);
    },
    [items],
  );

  const [openFavs, setOpenFavs] = useState(false);
  const openButtonLabel = useMemo(
    () => (openFavs ? "Lukk favoritter" : "Åpne favoritter"),
    [openFavs],
  );

  return (
    <>
      <div className="topbar">
        <FilterBar onFiltersChange={setFilters} />
        <button
          type="button"
          className="hamburger"
          aria-label={openButtonLabel}
          aria-expanded={openFavs}
          aria-controls="favorites-sheet"
          onClick={() => setOpenFavs((v) => !v)}
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
          {favs.length > 0 && (
            <span className="badge" aria-hidden="true">
              {favs.length}
            </span>
          )}
        </button>
      </div>

      <FavoritesSheet
        id="favorites-sheet"
        open={openFavs}
        favorites={favs}
        onClose={() => setOpenFavs(false)}
        onSelect={jumpTo}
        onToggleFavorite={(id, name) =>
          toggleFav((prev) =>
            prev.some((fav) => fav.id === id)
              ? prev.filter((fav) => fav.id !== id)
              : [...prev, { id, name }],
          )
        }
      />

      {listQ.isError && !hasResults && (
        <p className="error">Could not fetch drinks.</p>
      )}

      <div className="swipe-wrap">
        {hasResults && currentDrink ? (
          <>
            <div className="pager">
              <button
                className="nav left"
                onClick={prev}
                aria-label="Previous"
                disabled={index === 0}
              />
              <div className="card-slot" aria-live="polite">
                <Card
                  key={currentDrink.idDrink}
                  drink={currentDrink}
                  isFavorite={favs.some((f) => f.id === currentDrink.idDrink)}
                  onToggleFavorite={() =>
                    toggleFav((prev) =>
                      prev.some((fav) => fav.id === currentDrink.idDrink)
                        ? prev.filter((fav) => fav.id !== currentDrink.idDrink)
                        : [
                            ...prev,
                            {
                              id: currentDrink.idDrink,
                              name: currentDrink.strDrink,
                            },
                          ],
                    )
                  }
                />
              </div>
              <button
                className="nav right"
                onClick={next}
                aria-label="Next"
                disabled={index === items.length - 1}
              />
            </div>

            <div className="counter">
              {index + 1} / {items.length}
            </div>
          </>
        ) : (
          !listQ.isLoading && <p className="muted">No results.</p>
        )}
      </div>
    </>
  );
}
