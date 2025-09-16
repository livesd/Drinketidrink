import '@testing-library/jest-dom/vitest';
import { screen, render, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CocktailCard from "../components/card";
import type { Drink } from "../api/cocktails";

const drink: Drink = {
  idDrink: "11000",
  strDrink: "Mojito",
  strDrinkThumb: "https://example.com/mojito.jpg",
  strCategory: "Cocktail",
  strAlcoholic: "Alcoholic",
  strGlass: "Highball glass",
  strInstructions: "Mix and serve.",
};

test("renders title and toggles favorite", () => {
  const onToggle = vi.fn();

  render(
    <CocktailCard drink={drink} isFavorite={false} onToggleFavorite={onToggle} />
  );

  expect(screen.getByRole("heading", { name: /mojito/i })).toBeInTheDocument();
  const star = screen.getByRole("button", { name: /add to favorites/i });
  fireEvent.click(star);

  expect(onToggle).toHaveBeenCalledWith("11000", "Mojito");
});
