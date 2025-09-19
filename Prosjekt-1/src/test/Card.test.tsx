import "@testing-library/jest-dom/vitest";
import { screen, render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CocktailCard from "../components/card";
import type { Drink } from "../api/cocktails";

// Mock the toIngredients function
vi.mock("../api/cocktails", () => ({
  toIngredients: vi.fn(() => [
    { name: "Light rum", measure: "2-3 oz" },
    { name: "Lime", measure: "Juice of 1" },
    { name: "Sugar", measure: "2 tsp" },
    { name: "Mint", measure: "2-4" },
  ]),
}));

const drink: Drink = {
  idDrink: "11000",
  strDrink: "Mojito",
  strDrinkThumb: "https://example.com/mojito.jpg",
  strCategory: "Cocktail",
  strAlcoholic: "Alcoholic",
  strGlass: "Highball glass",
  strInstructions: "Mix and serve.",
  strIngredient1: "Light rum",
  strIngredient2: "Lime",
  strIngredient3: "Sugar",
  strIngredient4: "Mint",
  strMeasure1: "2-3 oz",
  strMeasure2: "Juice of 1",
  strMeasure3: "2 tsp",
  strMeasure4: "2-4",
};

test("renders title and toggles favorite", () => {
  const onToggle = vi.fn();

  render(
    <CocktailCard
      drink={drink}
      isFavorite={false}
      onToggleFavorite={onToggle}
    />,
  );

  expect(screen.getByRole("heading", { name: /mojito/i })).toBeInTheDocument();
  const star = screen.getByRole("button", { name: /add to favorites/i });
  fireEvent.click(star);

  expect(onToggle).toHaveBeenCalledWith("11000", "Mojito");
});

// Add these snapshot tests:
test("Card component matches snapshot when not favorite", () => {
  const onToggle = vi.fn();

  const { container } = render(
    <CocktailCard
      drink={drink}
      isFavorite={false}
      onToggleFavorite={onToggle}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});

test("Card component matches snapshot when favorite", () => {
  const onToggle = vi.fn();

  const { container } = render(
    <CocktailCard
      drink={drink}
      isFavorite={true}
      onToggleFavorite={onToggle}
    />,
  );

  expect(container.firstChild).toMatchSnapshot();
});
