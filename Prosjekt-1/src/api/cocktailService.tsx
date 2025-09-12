import {api} from "./apiClient";
import {validateCocktails} from "./schemas";
import type {Cocktail} from "./schemas";

//sjekker om streng er tom
function isBlank(s?: string) {
    return !s || s.trim().length === 0;
}

//cocktailsøk etter navn
export async function searchByName(name: string): Promise<Cocktail[]> {
    if (isBlank(name)) return [];
    const {data} = await api.get("/cocktail", {params: {name: name.trim()}});
    return validateCocktails(data);
}

//søk etter ingredienser
//ser for meg at dette kan brukes til spritfiltrering???
export async function ingredientsSearch(ingredients: string[] | string): Promise<Cocktail[]> {
    const csv = Array.isArray(ingredients) ? ingredients.map((s) => s.trim()).filter(Boolean).join(",") : (ingredients ?? "").trim();

    if (!csv) return [];
    const {data} = await api.get("/cocktail", {params: {ingredients: csv}});
    return validateCocktails(data);
}

