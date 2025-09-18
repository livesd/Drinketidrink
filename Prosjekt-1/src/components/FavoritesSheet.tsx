// src/components/FavoritesSheet.tsx
import { useEffect, useRef } from "react";

type Fav = { id: string; name: string };

type Props = {
  id?: string;
  open: boolean;
  favorites: Fav[];
  onClose: () => void;
  onSelect: (id: string) => void; // hopp til kort i lista
  onToggleFavorite: (id: string, name: string) => void;
};

export default function FavoritesSheet({
  id = "favorites-sheet",
  open,
  favorites,
  onClose,
  onSelect,
  onToggleFavorite,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // Lukk ved ESC
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  // Lukk ved klikk utenfor
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!open) return;
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open, onClose]);

  return (
    <div className={`sheet-backdrop ${open ? "open" : ""}`} aria-hidden={!open}>
      <aside
        id={id}
        ref={ref}
        className={`favorites-sheet ${open ? "open" : ""}`}
        role="dialog"
        aria-modal="false"
        aria-label="Favorites notepad"
      >
        <header className="sheet-header">
          <strong>Favorites</strong>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {favorites.length === 0 ? (
          <p className="muted small">No favorites yet.</p>
        ) : (
          <ul className="fav-list" role="list">
            {favorites.map((f) => (
              <li key={f.id} className="fav-item">
                <button
                  className="link"
                  onClick={() => {
                    onSelect(f.id);
                    onClose();
                  }}
                  title={`Vis ${f.name}`}
                >
                  {f.name}
                </button>
                <button
                  className="remove"
                  onClick={() => onToggleFavorite(f.id, f.name)}
                  aria-label={`Remove ${f.name} from favorites`}
                  title="Remove"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
