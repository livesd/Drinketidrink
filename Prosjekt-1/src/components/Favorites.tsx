import React from "react";

type Props = {
    favorites: { id: string, name: string } [];
    onToggleFavorite: (id: string, name: string) => void;
}

export default function Favorites( {favorites, onToggleFavorite}: Props) {
    return (
        <aside className = "favorites" >
            <h2>Favorites</h2>
            {favorites.length === 0 ? (
                <p>No favorites yet</p>
            ) : (
                <ul>
                    {favorites.map((fav) => (
                        <li key={fav.id}>
                            {fav.name}{" "}
                            <button onClick={() => onToggleFavorite(fav.id, fav.name)}>
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </aside>
    );
}




 