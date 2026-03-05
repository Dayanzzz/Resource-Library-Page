
export function buildActiveFilterLabels(filters) {

  // Build labels for each selected content type

  const contentTypeLabels = (filters?.contentTypes ?? []).map((value) => ({
    id: `ct-${value}`,
    label: value,
    kind: "content"
  }));


  // Build labels for each selected condition

  const conditionLabels = (filters?.conditions ?? []).map((value) => ({
    id: `cond-${value}`,
    label: value,
    kind: "condition"
  }));


  // If a search term is present, add a search label

  const searchLabel =
    typeof filters?.search === "string" && filters.search.trim()
      ? [
          {
            id: "search-label",
            label: `Search: ${filters.search.trim()}`,
            kind: "search"
          }
        ]
      : [];

  // Combine all label types into a single array

  return [...contentTypeLabels, ...conditionLabels, ...searchLabel];
}

// Returns:
//   Array of label objects for each active filter (content type, condition, search)