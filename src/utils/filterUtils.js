function matchesSelectedValues(value, selectedValues) {

  // If no values are selected for a filter group, we treat it as "match all".

  if (!Array.isArray(selectedValues) || !selectedValues.length) {
    return true;
  }

  return selectedValues.includes(value);
}

function toComparableString(value) {

  // Normalizes unknown/null input so string operations never throw.

  if (value == null) {
    return "";
  }

  return String(value);
}

function getDateTimestampOrNull(value) {

  // Invalid or missing dates are represented as null.

  const timestamp = Date.parse(toComparableString(value));
  return Number.isNaN(timestamp) ? null : timestamp;
}

function compareDatesWithInvalidLast(firstDateValue, secondDateValue, direction) {
  const firstTimestamp = getDateTimestampOrNull(firstDateValue);
  const secondTimestamp = getDateTimestampOrNull(secondDateValue);

  // Keep invalid/missing dates at the bottom regardless of sort direction.

  if (firstTimestamp == null && secondTimestamp == null) {
    return 0;
  }

  if (firstTimestamp == null) {
    return 1;
  }

  if (secondTimestamp == null) {
    return -1;
  }

  return (firstTimestamp - secondTimestamp) * direction;
}

function matchesSearch(resource, search) {

  // Guard against undefined/non-string search input from upstream state.

  const safeSearch = typeof search === "string" ? search : "";

  if (!safeSearch.trim()) {
    return true;
  }

  const query = safeSearch.toLowerCase().trim();
  const searchableText = [
    toComparableString(resource?.title),
    toComparableString(resource?.excerpt)
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}

function sortResources(resources, sort) {

  // Always sort a copy so original resource data is never mutated.

  const sorted = Array.isArray(resources) ? [...resources] : [];

  switch (sort) {
    case "date-asc":
      sorted.sort((a, b) => compareDatesWithInvalidLast(a?.date, b?.date, 1));
      break;
    case "title-asc":
      sorted.sort((a, b) =>
        toComparableString(a?.title).localeCompare(toComparableString(b?.title), undefined, {
          sensitivity: "base"
        })
      );
      break;
    case "title-desc":
      sorted.sort((a, b) =>
        toComparableString(b?.title).localeCompare(toComparableString(a?.title), undefined, {
          sensitivity: "base"
        })
      );
      break;
    case "date-desc":
    default:
      sorted.sort((a, b) => compareDatesWithInvalidLast(a?.date, b?.date, -1));
  }

  return sorted;
}

export function filterAndSortResources(resources, filters) {

  // Defensive defaults keep the app stable even if JSON shape changes unexpectedly.
  
  const safeResources = Array.isArray(resources) ? resources.filter(Boolean) : [];
  const safeFilters = filters ?? {};

  const filtered = safeResources.filter(
    (resource) =>
      matchesSelectedValues(resource?.contentType, safeFilters.contentTypes) &&
      matchesSelectedValues(resource?.condition, safeFilters.conditions) &&
      matchesSearch(resource, safeFilters.search)
  );

  return sortResources(filtered, safeFilters.sort);
}