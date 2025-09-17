import type { Drink } from "../api/cocktails";
import { toIngredients } from "../api/cocktails";
import "./Card.css";

type Props = {
  drink: Drink;
};

export default function CocktailCard({ drink }: Props) {
  const ingredients = toIngredients(drink);

  return (
    <article
      className="card drink-card"
      aria-labelledby={`drink-${drink.idDrink}-title`}
    >
      <header className="lyrics-header">
        <h2 id={`drink-${drink.idDrink}-title`}>{drink.strDrink}</h2>
      </header>

      <p className="meta">
        <strong>Alcohol:</strong> {drink.strAlcoholic ?? "–"} ·{" "}
        <strong>Glass:</strong> {drink.strGlass ?? "–"}
      </p>

      <div className="media">
        <img
          className="thumb"
          src={drink.strDrinkThumb}
          alt={drink.strDrink}
          width={160}
          height={160}
          loading="lazy"
          decoding="async"
        />

        <div>
          <h3 className="sr-only">Ingredients</h3>

          {ingredients.length > 0 ? (
            <table className="nutrition" aria-label="Ingredients">
              <tbody>
                {ingredients.map((row, i) => (
                  <tr key={`${row.ingredient}-${i}`}>
                    <th scope="row">{row.ingredient}</th>
                    <td>{row.measure ?? ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="muted">No ingredients listed.</p>
          )}

          {drink.strInstructions && (
            <p className="instructions">
              <strong>Instructions:</strong> {drink.strInstructions}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
