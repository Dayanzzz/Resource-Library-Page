import React from "react";

const sortOptions = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "title-asc", label: "Title A-Z" },
  { value: "title-desc", label: "Title Z-A" }
];

function SortDropdown({ value, onChange }) {
  return (
    <div className="sort-wrap">
      <label htmlFor="sort-resources">Sort</label>
      <select
        id="sort-resources"
        value={value ?? "date-desc"}
        onChange={(event) => onChange?.(event.target.value)}
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.memo(SortDropdown);