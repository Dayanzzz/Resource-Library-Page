import React from "react";
import ResourceCard from "./ResourceCard";

function ResourceGrid({ resources, onClearFilters }) {
  const safeResources = Array.isArray(resources) ? resources : [];

  if (safeResources.length === 0) {
    return (
      <section className="empty-state" aria-live="polite">
        <h2>No resources match your filters</h2>
        <p>Try clearing filters or adjusting your search.</p>
        <button type="button" className="clear-button" onClick={onClearFilters}>
          Clear Filters
        </button>
      </section>
    );
  }

  return (
    <section className="resource-grid" aria-label="Resource results">
      {safeResources.map((resource, index) => (
        <ResourceCard key={resource?.id ?? `${resource?.title ?? "resource"}-${index}`} resource={resource} />
      ))}
    </section>
  );
}

export default React.memo(ResourceGrid);