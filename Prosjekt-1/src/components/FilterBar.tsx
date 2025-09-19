import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAlcoholicOptions } from "../api/cocktails";
import { useSessionStorage } from "../hooks/useSessionStorage";
import "./filterBar.css";

type FilterPanelProps = {
  onFiltersChange: (filters: { qName: string; alc: string }) => void;
};


export default function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const [qName, setQName] = useSessionStorage<string>("ct-qname", "");
  const [alc, setAlc] = useSessionStorage<string>("ct-alc", "");



  //Gets the alcohol options
  const { data: alcOptions = [] } = useQuery({
    queryKey: ["ct-alc-list"],
    queryFn: getAlcoholicOptions,
    staleTime: 30 * 60 * 1000,
  });


  useEffect(() => {
    onFiltersChange({ qName, alc });
  }, [qName, alc, onFiltersChange]);

  return (
    <form className="searchbar" aria-label="Filter cocktails" onSubmit={(e) => e.preventDefault()}>
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
          {alcOptions.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </label>
    </form>
  );
}
