import { useSearchParams } from "react-router-dom";
import type { ChangeEvent } from "react";

const COLORS = ["red", "green", "blue", "purple", "orange", "yellow"];

// The filter text lives in the URL ("?q=...") via useSearchParams, not in
// local component state — refreshing or sharing the URL keeps the filter.
function SearchParamsDemo() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    const value = event.target.value;
    setSearchParams(value ? { q: value } : {});
  }

  const filtered = COLORS.filter((color) => color.includes(query.toLowerCase()));

  return (
    <div>
      <p className="status-message">
        Typing here updates the URL's query string via useSearchParams. Try refreshing the page or
        copying the URL — the filter survives, unlike plain component state.
      </p>
      <div className="form-row">
        <input type="text" placeholder="Filter colors" value={query} onChange={handleChange} />
      </div>
      <ul>
        {filtered.map((color) => (
          <li key={color}>{color}</li>
        ))}
        {filtered.length === 0 && <li>No matches.</li>}
      </ul>
    </div>
  );
}

export default SearchParamsDemo;
