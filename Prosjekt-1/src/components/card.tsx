import type { Drink } from "../api/cocktails.ts";
import { toIngredients } from "../api/cocktails.ts";
import "./Card.css";

type Props = { // defines the props for the CocktailCard component
  drink: Drink;
  isFavorite: boolean;
  onToggleFavorite: (id: string, name: string) => void; // when favorite button is clicked, this method is called
};

export default function CocktailCard({ drink, isFavorite, onToggleFavorite }: Props) { 
  const ingredients = toIngredients(drink); // create ingredients list from drink object

  return (
    <article className = "card drink-card" aria-labelledby = {`drink-${drink.idDrink}-title`}> 
        <header className = "card-header"> {/* NB! har blitt kalt lyrics-header, pass på å sjekk dette! */}
            <h2 id = {`drink-${drink.idDrink}-title`}>{drink.strDrink}</h2>

            <button // favorite button
            type = "button"
            className = "fav-btn"
            aria-pressed = {isFavorite} // indicates if the button is toggled
            aria-label = {isFavorite ? "Remove from favorites" : "Add to favorites"}
            title = {isFavorite ? "Remove from favorites" : "Add to favorites"} 
            onClick={() => onToggleFavorite(drink.idDrink, drink.strDrink)} // calls the parent function onToggleFavorite with the drink’s ID and name.
            >
            {isFavorite ? "★" : "☆"} {/* filled star for favorite, empty star for not favorite */}
            </button>
        </header>

       
        <p className = "meta">  {/* Metadata about the drink: category (cocktail, beer, coffee etc), Alcohol (alcoholic, non alcoholic etc) and glass type*/}
            <strong>Category:</strong> {drink.strCategory ?? "-"} ·{" "} {/* if a field is null or undefined, display "-" instead */}
            <strong>Alcohol:</strong> {drink.strAlcoholic ?? "-"} ·{" "}
            <strong>Glass:</strong> {drink.strGlass ?? "-"} 
        </p>

        <div className = "media"> {/* Displays the image of the drink */}
            <img
            className = "thumb"
            src = {drink.strDrinkThumb}
            alt = {drink.strDrink}
            width = {160}
            height = {160}
            loading = "lazy" /* lazy loading for better performance; delays loading until needed */
            decoding = "async" /* async decoding for better performance; tells the browser not to block rendering */
            />

        <div>
          <h3 className = "ScreenReader-only ">Ingredients</h3> {/* Ingredients list, NB! Har blitt kalt "sr-only" */} 

          {ingredients.length > 0 ? ( // if there are ingredients, display them in a table
            <table className="nutrition" aria-label="Ingredients">
              <tbody>
                {ingredients.map((row, i) => (
                  <tr key = {`${row.ingredient}-${i}`}> {/* key should be unique, so we use both ingredient name and index */}
                    <th scope = "row">{row.ingredient}</th> {/* ingredient name */}
                    <td>{row.measure ?? ""}</td> {/* ingredient amount, if null or undefined, display empty string */}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className = "muted">No ingredients listed.</p> // if no ingredients, display this message
          )}

          {drink.strInstructions && (
            <p className = "instructions">
              <strong>Instructions:</strong> {drink.strInstructions}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}