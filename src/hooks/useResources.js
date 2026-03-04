import { useMemo } from "react";
import resources from "../data/resources.json";

function normalizeResource(item, index) {

  // Normalizes each record to a safe shape so rendering/filtering cannot crash.

  if (!item || typeof item !== "object") {
    return {
      resource: {
        id: `invalid-${index}`,
        title: "Untitled resource",
        excerpt: "",
        date: "",
        contentType: "Unknown",
        condition: "Unknown",
        author: "Unknown",
        url: ""
      },
      hadIssues: true
    };
  }

  const normalized = {
    id: item.id ?? `resource-${index}`,
    title: item.title == null ? "Untitled resource" : String(item.title),
    excerpt: item.excerpt == null ? "" : String(item.excerpt),
    date: item.date == null ? "" : String(item.date),
    contentType: item.contentType == null ? "Unknown" : String(item.contentType),
    condition: item.condition == null ? "Unknown" : String(item.condition),
    author: item.author == null ? "Unknown" : String(item.author),
    url: item.url == null ? "" : String(item.url)
  };

  const hadIssues =
    item.id == null ||
    item.title == null ||
    item.excerpt == null ||
    item.date == null ||
    item.contentType == null ||
    item.condition == null ||
    item.author == null ||
    item.url == null;

  return {
    resource: normalized,
    hadIssues
  };
}

function getUniqueSortedValues(items, key) {

  // Option lists are derived from data and sorted consistently for stable UI.

  if (!Array.isArray(items)) {
    return [];
  }

  return [...new Set(items.map((item) => item?.[key]).filter((value) => value != null))].sort(
    (a, b) => String(a ?? "").localeCompare(String(b ?? ""))
  );
}

function useResources() {
  const { safeResources, dataWarning } = useMemo(() => {

    // Basic runtime validation for imported JSON data shape.

    if (!Array.isArray(resources)) {
      return {
        safeResources: [],
        dataWarning: "Resource data was not in the expected array format. Showing no results."
      };
    }

    let invalidCount = 0;
    const normalizedResources = resources.map((item, index) => {
      const { resource, hadIssues } = normalizeResource(item, index);

      if (hadIssues) {
        invalidCount += 1;
      }

      return resource;
    });

    return {
      safeResources: normalizedResources,
      dataWarning:
        invalidCount > 0
          ? `${invalidCount} resource record${invalidCount === 1 ? " was" : "s were"} missing fields and automatically normalized.`
          : ""
    };
  }, []);

  const contentTypeOptions = useMemo(

    // Memoized to avoid recomputing options on every App render.

    () => getUniqueSortedValues(safeResources, "contentType"),
    [safeResources]
  );

  const conditionOptions = useMemo(

    
    () => getUniqueSortedValues(safeResources, "condition"),
    [safeResources]
  );

  return {
    resources: safeResources,
    contentTypeOptions,
    conditionOptions,
    dataWarning
  };
}

export default useResources;