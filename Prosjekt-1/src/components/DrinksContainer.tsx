import { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import FilterBar from "./FilterBar";
import Card from "./Card";
import {
  searchByName,
  filterByAlcoholic,
  lookupById,
  getInitialDeck,
  toLite,
  type Drink,
  type DrinkLite,
} from "../api/cocktails";

function normalizeLabel(s: string | null | undefined) {
  return (s ?? "").toLowerCase().replace(/[_\s]+/g, "");
}

function fromLite(l: DrinkLite): Drink {
  return {
    ...l,
    strCategory: null,
    strAlcoholic: null,
    strGlass: null,
    strInstructions: null,
  };
}

export default function DrinksContainer() {
  const [filters, setFilters] = useState({ qName: "", alc: "" });
  const usingFilters = Boolean(filters.qName.trim() || filters.alc.trim());

  const q = useQuery({
    queryKey: usingFilters
      ? ["drinks-lite", "filters", filters.qName, filters.alc]
      : ["drinks-lite", "initial"],
    staleTime: 1000 * 60 * 10,
    queryFn: async (): Promise<DrinkLite[]> => {
      if (filters.qName.trim()) {
        const byName = await searchByName(filters.qName);
        const narrowed = filters.alc
          ? byName.filter(
              (d) => normalizeLabel(d.strAlcoholic) === normalizeLabel(filters.alc)
            )
          : byName;
        return narrowed.map(toLite);
      }
      if (filters.alc.trim()) {
        return await filterByAlcoholic(filters.alc);
      }
      const deck = await getInitialDeck();
      return deck.map(toLite);
    },
  });

  const items = q.data ?? []; 

  const useRandom = !q.isLoading && items.length === 0;
  const randomQ = useQuery({
    queryKey: ["random-fallback", filters.qName, filters.alc],
    enabled: useRandom,
    queryFn: async (): Promise<Drink> => getRandomDrink(),
    staleTime: 1000 * 60,
  });

  const navItems: DrinkLite[] =
    items.length > 0
      ? items
      : randomQ.data
      ? [toLite(randomQ.data as Drink)]
      : [];

  const [index, setIndex] = useState(0);
  useEffect(() => setIndex(0), [navItems.length]);

  const hasResults = navItems.length > 0;
  const currentLite = hasResults ? navItems[index] : null;

  const next = useCallback(() => {
    if (!hasResults) return;
    setIndex((i) => Math.min(i + 1, navItems.length - 1));
  }, [hasResults, navItems.length]);

  const prev = useCallback(() => {
    if (!hasResults) return;
    setIndex((i) => Math.max(i - 1, 0));
  }, [hasResults]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const detailsQ = useQuery({
    queryKey: ["drink-detail", currentLite?.idDrink],
    enabled: !!currentLite,
    queryFn: async () => lookupById(currentLite!.idDrink),
    staleTime: 1000 * 60 * 10,
  });

  const currentDrink: Drink | null =
    currentLite ? (detailsQ.data ?? fromLite(currentLite)) : null;

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

  const showTopLoading = q.isLoading || (useRandom && randomQ.isLoading);

  return (
    <>
      <FilterBar onFiltersChange={setFilters} />

      {showTopLoading && <p className="muted">Loading…</p>}
      {q.isError && !hasResults && <p className="error">Could not fetch drinks.</p>}

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
                disabled={index === navItems.length - 1}
              />
            </div>

            <div className="counter">
              {index + 1} / {navItems.length}
              {!usingFilters && items.length > 0 && <> &nbsp;• All drinks</>}
            </div>
          </>
        ) : (
          !showTopLoading && <p className="muted">No results.</p>
        )}
      </div>
    </>
  );
}

async function getRandomDrink(): Promise<Drink> {
  const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
  if (!response.ok) {
    throw new Error("Failed to fetch a random drink");
  }
  const data = await response.json();
  if (!data.drinks || data.drinks.length === 0) {
    throw new Error("No random drink found");
  }
  return data.drinks[0];
}


