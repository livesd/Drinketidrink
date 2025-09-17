// src/components/CocktailBrowser.tsx
import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FilterBar from "./FilterBar";
import Card from "./card"

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
    queryFn: async () => (currentLite ? lookupById(currentLite.idDrink) : null),
    staleTime: 10 * 60 * 1000,
  });

  const currentDrink: Drink | null = currentLite
    ? detailQ.data ?? fromLite(currentLite)
    : null;

  const next = useCallback(
    () => hasResults && setIndex((i) => Math.min(i + 1, items.length - 1)),
    [hasResults, items.length]
  );
  const prev = useCallback(
    () => hasResults && setIndex((i) => Math.max(i - 1, 0)),
    [hasResults]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const [favs, setFavs] = useState<Set<string>>(new Set());
  const toggleFav = (id: string) =>
    setFavs((s) => {
      const n = new Set(s);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });

  return (
    <>
      <FilterBar onFiltersChange={setFilters} />

      {(listQ.isLoading || detailQ.isLoading) && (
        <p className="muted">Loading…</p>
      )}
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
                  isFavorite={favs.has(currentDrink.idDrink)}
                  onToggleFavorite={(id) => toggleFav(id)}
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
              {!usingFilters && items.length > 0}
            </div>
          </>
        ) : (
          !listQ.isLoading && <p className="muted">No results.</p>
        )}
      </div>
    </>
  );
}
