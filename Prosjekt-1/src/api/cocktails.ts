// src/api/cocktails.ts
export const BASE = "https://www.thecocktaildb.com/api/json/v1/1";
export type DrinkLite = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
};
export type Drink = DrinkLite & {
  strCategory: string | null;
  strAlcoholic: string | null;
  strGlass: string | null;
  strInstructions: string | null;
  [key: string]: string | null | undefined;
};
async function get<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CocktailDB ${res.status}`);
  return res.json() as Promise<T>;
}

export async function getAlcoholicOptions(): Promise<string[]> {
  const data = await get<{ drinks: { strAlcoholic: string }[] }>(`${BASE}/list.php?a=list`);
  return (data.drinks ?? []).map((d) => d.strAlcoholic).sort((a, b) => a.localeCompare(b));
}
export async function searchByName(name: string): Promise<Drink[]> {
  const q = encodeURIComponent(name.trim());
  if (!q) return [];
  const data = await get<{ drinks: Drink[] | null }>(`${BASE}/search.php?s=${q}`);
  return data.drinks ?? [];
}

export async function filterByAlcoholic(kind: string): Promise<DrinkLite[]> {
  const q = encodeURIComponent(kind);
  const data = await get<{ drinks: DrinkLite[] | null }>(`${BASE}/filter.php?a=${q}`);
  return data.drinks ?? [];
}
export async function lookupById(id: string): Promise<Drink | null> {
  const data = await get<{ drinks: Drink[] | null }>(`${BASE}/lookup.php?i=${id}`);
  return data.drinks?.[0] ?? null;
}
// Lag en pen ingrediensliste fra strIngredient1..15 + strMeasure1..15
export function toIngredients(d: Drink) {
  const out: { ingredient: string; measure?: string }[] = [];
  for (let i = 1; i <= 15; i++) {
    const ing = d[`strIngredient${i}`];
    const mea = d[`strMeasure${i}`];
    if (ing && ing.trim()) out.push({ ingredient: ing.trim(), measure: mea?.trim() });
  }
  return out;
}






