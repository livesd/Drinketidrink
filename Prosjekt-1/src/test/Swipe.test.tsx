import "@testing-library/jest-dom/vitest";
import { render } from "@testing-library/react";
import { vi } from "vitest";
import CocktailCard from "../components/Swipe";
import type { Drink } from "../api/cocktails";

// Mock the toIngredients function
vi.mock("../api/cocktails", () => ({
  toIngredients: vi.fn(() => [
    { name: "Light rum", measure: "2-3 oz" },
    { name: "Lime", measure: "Juice of 1" },
    { name: "Sugar", measure: "2 tsp" },
    { name: "Mint", measure: "2-4" },
  ])
}));

const mockDrink: Drink = {
  idDrink: "11000",
  strDrink: "Mojito",
  strDrinkThumb: "https://www.thecocktaildb.com/images/media/drink/metwgh1606770327.jpg",
  strCategory: "Cocktail",
  strAlcoholic: "Alcoholic",
  strGlass: "Highball glass",
  strInstructions: "Muddle mint leaves with sugar and lime juice. Add a splash of soda water and fill the glass with cracked ice.",
  strIngredient1: "Light rum",
  strIngredient2: "Lime",
  strIngredient3: "Sugar",
  strIngredient4: "Mint",
  strIngredient5: "Soda water",
  strMeasure1: "2-3 oz",
  strMeasure2: "Juice of 1",
  strMeasure3: "2 tsp",
  strMeasure4: "2-4",
  strMeasure5: null,
};

test("CocktailCard matches snapshot", () => {
  const { container } = render(<CocktailCard drink={mockDrink} />);
  expect(container.firstChild).toMatchSnapshot();
});

test("CocktailCard with minimal data matches snapshot", () => {
  const minimalDrink: Drink = {
    ...mockDrink,
    strAlcoholic: null,
    strGlass: null,
    strInstructions: null,
    strIngredient1: null,
    strIngredient2: null,
    strIngredient3: null,
    strIngredient4: null,
    strIngredient5: null,
  };

  const { container } = render(<CocktailCard drink={minimalDrink} />);
  expect(container.firstChild).toMatchSnapshot();
});