import { z } from "zod";

// deler opp dataen i schema
export const CocktailSchema = z.object({
    name: z.string(),
    instructions: z.string().optional().nullable().default(""),
    ingredients: z.array(z.string().min(1)).default([]),
});

export const CocktailList = z.array(CocktailSchema);

// typer
export type CocktailDrink = z.infer<typeof CocktailSchema>;
export type ListOfCocktails = z.infer<typeof CocktailList>;
// brukervennlig type
export type Cocktail = {
    id: string;
    name: string;
    instructions: string;
    ingredients: string[];
    ingredientsNormalized: string[]; //lowercase og trimmede strings
}

// lager id til cocktails
function CocktailId(s: string): string {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
        h = (h * 31 + s.charCodeAt(i)) | 0;
    }
    return Math.abs(h).toString(16); //konverterer til positiv hexa
}

//slugify - lesbar og brukervennlig id
function slugify(s: string): string {
    return s
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

export function mapCocktail(raw: CocktailDrink): Cocktail {
    const name = raw.name.trim();
    const instructions = (raw.instructions ?? "").trim();
    const ingredients = raw.ingredients ?? [];
    const ingredientsNormalized = ingredients.map((x) => x.toLowerCase().trim());
    
    const id = `${slugify(name)}-${CocktailId(instructions || name)}`;
    
    return {
        id,
        name,
        instructions,
        ingredients,
        ingredientsNormalized,
    };
}

// validasjon av cocktailliste
export function validateCocktails(data: unknown): Cocktail[] {
    const parsed = CocktailList.parse(data);
    return parsed.map(mapCocktail);
}