import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchByName } from "./cocktailService";
import type { Cocktail } from "./schemas";

export const cocktailKeys = {
  byName: (q: string) => ["cocktails", "name", q] as const,
};

export function useCocktailsByName(q: string) {
  return useQuery<Cocktail[]>({
    queryKey: cocktailKeys.byName(q),
    queryFn: () => searchByName(q),
    enabled: q.trim().length > 0,
    placeholderData: keepPreviousData,
  });
}
