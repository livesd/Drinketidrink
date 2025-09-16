export const BASE = "https://www.thecocktaildb.com/api/json/v1/1"; //link to api

//returns the id, name and picture of the cocktails from the api
export type DrinkLite = {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
};

//complete drink type with all properties from the api
export type Drink = DrinkLite & {
  strCategory: string | null; 
  strAlcoholic: string | null; 
  strGlass: string | null; 
  strInstructions: string | null; 
  [key: string]: string | null | undefined;
};

//generic function to fetch data from the API
async function get<T>(url: string): Promise<T> {
  const res = await fetch(url); //get call to the url
  if (!res.ok) throw new Error(`CocktailDB ${res.status}`); //error handling
  return res.json() as Promise<T>; //returns the fetched data as json
}

//GET function for if the drink contains alcohol or not
export async function getAlcoholicOptions(): Promise<string[]> {
  const data = await get<{ drinks: { strAlcoholic: string }[] }>(`${BASE}/list.php?a=list`); //returns a list of alcoholic options
  return (data.drinks ?? []).map((d) => d.strAlcoholic).sort((a, b) => a.localeCompare(b)); //sorts the list alphabetically
}

//search function for drinks, searched by drink name 
export async function searchByName(name: string): Promise<Drink[]> {
  const q = encodeURIComponent(name.trim());
  if (!q) return []; //if result is empty, return empty array to prevent useless emtpy calls to the api
  const data = await get<{ drinks: Drink[] | null }>(`${BASE}/search.php?s=${q}`);
  return data.drinks ?? []; //returns an array of drinks or an empty array if no drinks are found
}

//function for filtering drink by alcohol type
export async function filterByAlcoholic(kind: string): Promise<DrinkLite[]> {
  const q = encodeURIComponent(kind);
  const data = await get<{ drinks: DrinkLite[] | null }>(`${BASE}/filter.php?a=${q}`); //returns the lite items without ingredients or instructions
  return data.drinks ?? []; //returns the drinks data or an empty array if no drinks are found
}

//function to look up a spesific drink by its id
export async function lookupById(id: string): Promise<Drink | null> {
  const data = await get<{ drinks: Drink[] | null }>(`${BASE}/lookup.php?i=${id}`);
  return data.drinks?.[0] ?? null; //returns a drinks detailed data or null if no drink is found
}
//makes a neat ingredient list of a drink
export function toIngredients(d: Drink) {
  const out: { ingredient: string; measure?: string }[] = [];
  //loops through the ingredients and the corresponding measures
  for (let i = 1; i <= 15; i++) {
    const ing = d[`strIngredient${i}`];
    const mea = d[`strMeasure${i}`];
    //creates a neat showing of the ingredient and the measure
    if (ing && ing.trim()) out.push({ ingredient: ing.trim(), measure: mea?.trim() });
  }
  return out; //returns the neat list of ingredients with measures
}






