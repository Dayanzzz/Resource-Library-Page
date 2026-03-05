import React from "react";
import { useCallback, useMemo, useState } from "react";
import FiltersPanel from "./components/FiltersPanel";
import ResourceGrid from "./components/ResourceGrid";
import SearchBar from "./components/SearchBar";
import SortDropdown from "./components/SortDropdown";
import SuggestResourceForm from "./components/SuggestResourceForm";
import useResources from "./hooks/useResources";
import useUrlFilters from "./hooks/useUrlFilters";
import { filterAndSortResources } from "./utils/filterUtils";
import useSuggestedResources from "./hooks/useSuggestedResources";
import { buildActiveFilterLabels } from "./utils/activeFilterLabels";

function App() {
  const { resources, contentTypeOptions, conditionOptions, dataWarning } = useResources();
  const { filters, setFilters, clearFilters } = useUrlFilters();
  const [currentView, setCurrentView] = useState("browse");
  const { suggestedResources, setSuggestedResources } = useSuggestedResources();

  const allResources = useMemo(() => (Array.isArray(resources) ? resources : []), [resources]);

  // Expensive work (filter + sort) only reruns when resources or filters actually change.
  
  const filteredResources = useMemo(
    () => filterAndSortResources(allResources, filters),
    [allResources, filters]
  );

  const activeFilterLabels = useMemo(() => buildActiveFilterLabels(filters), [filters]);

  // Stable handlers help memoized child components skip unnecessary rerenders.

  const updateSearch = useCallback((search) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const updateSort = useCallback((sort) => {
    setFilters((prev) => ({ ...prev, sort }));
  }, []);

  const toggleFilterValue = useCallback((key, value) => {
    setFilters((prev) => {

      // Defensive fallback keeps toggling safe even if filter arrays are missing.

      const current = prev[key] ?? [];
      const hasValue = current.includes(value);

      return {
        ...prev,
        [key]: hasValue ? current.filter((item) => item !== value) : [...current, value]
      };
    });
  }, []);

  const onToggleContentType = useCallback(
    (value) => toggleFilterValue("contentTypes", value),
    [toggleFilterValue]
  );

  const onToggleCondition = useCallback(
    (value) => toggleFilterValue("conditions", value),
    [toggleFilterValue]
  );

  const addSuggestedResource = useCallback((resource) => {
    setSuggestedResources((prev) => [resource, ...prev]);
  }, []);

  const openSuggestPage = useCallback(() => {
    setCurrentView("suggest");
  }, []);

  const openBrowsePage = useCallback(() => {
    setCurrentView("browse");
  }, []);

  return (
    <main className="page">
      <nav className="skip-links" aria-label="Skip links">
        <a href="#search-controls">Skip to search and sort</a>
        <a href="#filters-and-results">Skip to filters and results</a>
        <a href="#resource-results">Skip to results</a>
      </nav>

      <header className="page-header">
        <h1>Metabolic Mind Resource Library</h1>
        <p>
          Browse educational resources for patients, families, clinicians, and researchers.
          <br />
          Use search, filters, and sorting to quickly find relevant content.
        </p>
        <div className="page-actions">
          {currentView === "browse" ? (
            <button
              type="button"
              className="clear-button header-action-btn header-action-btn-primary"
              onClick={openSuggestPage}
            >
              <span className="cta-icon" aria-hidden="true">+</span>
              <span>Suggest a Resource</span>
            </button>
          ) : (
            <button
              type="button"
              className="clear-button header-action-btn header-action-btn-primary"
              onClick={openBrowsePage}
            >
              <span className="cta-icon" aria-hidden="true">←</span>
              <span>Back to Resources</span>
            </button>
          )}
        </div>
      </header>

      {currentView === "browse" ? (
        <>
          <section
            id="search-controls"
            tabIndex={-1}
            className="toolbar"
            aria-label="Search and sort resources"
          >
            <SearchBar value={filters.search} onChange={updateSearch} />
            <SortDropdown value={filters.sort} onChange={updateSort} />
          </section>

          <section
            id="filters-and-results"
            tabIndex={-1}
            className="content-layout"
            aria-label="Filters and resource results"
          >
            <FiltersPanel
              contentTypeOptions={contentTypeOptions}
              conditionOptions={conditionOptions}
              selectedContentTypes={filters.contentTypes}
              selectedConditions={filters.conditions}
              onToggleContentType={onToggleContentType}
              onToggleCondition={onToggleCondition}
              onClearAll={clearFilters}
            />

            <div id="resource-results" tabIndex={-1} className="results-column">
              <p className="result-count" aria-live="polite">
                Showing {filteredResources.length} of {allResources.length} resources
              </p>

              {activeFilterLabels.length > 0 ? (
                <section className="active-filters" aria-label="Active filters">
                  <p className="active-filters-label">Active filters</p>
                  <div className="active-filters-row">
                    {activeFilterLabels.map((labelItem) => (
                      <span
                        key={labelItem.id}
                        className={`active-filter-label active-filter-label-${labelItem.kind}`}
                      >
                        {labelItem.label}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}

              {/* Non-blocking warning makes malformed JSON visible without breaking the UI. */}

              {dataWarning ? (
                <p className="data-warning" role="status" aria-live="polite">
                  {dataWarning}
                </p>
              ) : null}
              <ResourceGrid resources={filteredResources} onClearFilters={clearFilters} />
            </div>
          </section>
        </>
      ) : (
        <section className="suggest-page" aria-label="Suggest resource page">
          <SuggestResourceForm onAddSuggestion={addSuggestedResource} />
        </section>
      )}
    </main>
  );
}

export default App;