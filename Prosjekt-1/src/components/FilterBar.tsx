import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAlcoholicOptions } from "../api/cocktails";
import { useSessionStorage } from "../hooks/useSessionStorage";
import "./filterBar.css";


type FilterPanelProps = {
  onFiltersChange: (filters: { qName: string; alc: string }) => void;
};

export default function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  /** ===== Filters (session) ===== */
  const [qName, setQName] = useSessionStorage<string>("ct-qname", "");
  const [alc, setAlc] = useSessionStorage<string>("ct-alc", "");

  /** ===== Debounce search text ===== */
  const [qNameDebounced, setQNameDebounced] = useState(qName);
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => setQNameDebounced(qName), 350);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [qName]);

  /** ===== Lookup alcohol options ===== */
  const alcQ = useQuery({
    queryKey: ["ct-alc-list"],
    queryFn: getAlcoholicOptions,
    staleTime: 30 * 60 * 1000,
  });

  /** ===== Notify parent whenever filters change ===== */
  useEffect(() => {
    onFiltersChange({ qName: qNameDebounced, alc });
  }, [qNameDebounced, alc, onFiltersChange]);

  return (
    <form
      className="searchbar"
      aria-label="Filter cocktails"
      onSubmit={(e) => e.preventDefault()}
    >
      <label>
        Name of cocktail

        <input
          type="search"
          placeholder="Search for a drink..."
          value={qName}
          onChange={(e) => setQName(e.target.value)}
        />
      </label>

      <label>
        Alcohol
        <select value={alc} onChange={(e) => setAlc(e.target.value)}>
          <option value="">All</option>
          {(alcQ.data ?? []).map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}