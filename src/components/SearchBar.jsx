import React from "react";

function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <label htmlFor="resource-search">Search resources</label>
      <input
        id="resource-search"
        type="search"
        value={value ?? ""}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder="Search by title and summary/excerpt"
        aria-label="Search resources"
      />
    </div>
  );
}

export default React.memo(SearchBar);