import React from "react";

function FilterGroup({ title, options, selectedValues, onToggle, inputName }) {
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSelectedValues = Array.isArray(selectedValues) ? selectedValues : [];

  return (
    <fieldset className="filter-group">
      <legend>{title}</legend>
      {safeOptions.map((option) => {
        const optionLabel = option ?? "";
        const id = `${inputName}-${String(optionLabel).toLowerCase().replace(/\s+/g, "-")}`;

        return (
          <label key={id} htmlFor={id} className="checkbox-row">
            <input
              id={id}
              type="checkbox"
              checked={safeSelectedValues.includes(option)}
              onChange={() => onToggle?.(option)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onToggle?.(option);
                }
              }}
            />
            <span>{optionLabel}</span>
          </label>
        );
      })}
    </fieldset>
  );
}

const MemoFilterGroup = React.memo(FilterGroup);

function FiltersContent({
  contentTypeOptions,
  conditionOptions,
  selectedContentTypes,
  selectedConditions,
  onToggleContentType,
  onToggleCondition,
  onClearAll
}) {
  return (
    <>
      <MemoFilterGroup
        title="Content Type"
        options={contentTypeOptions}
        selectedValues={selectedContentTypes}
        onToggle={onToggleContentType}
        inputName="content-type"
      />
      <MemoFilterGroup
        title="Condition"
        options={conditionOptions}
        selectedValues={selectedConditions}
        onToggle={onToggleCondition}
        inputName="condition"
      />
      <button type="button" className="clear-button" onClick={onClearAll}>
        Clear All Filters
      </button>
    </>
  );
}

const MemoFiltersContent = React.memo(FiltersContent);

function FiltersPanel(props) {
  return (
    <>
      <aside className="filters-panel filters-panel-desktop" aria-label="Filter resources">
        <h2>Filters</h2>
        <MemoFiltersContent {...props} />
      </aside>

      <details className="filters-panel-mobile">
        <summary>Filters</summary>
        <div className="filters-panel-mobile-content" role="group" aria-label="Filter resources">
          <MemoFiltersContent {...props} />
        </div>
      </details>
    </>
  );
}

function areArraysEqual(a, b) {

  // Small array equality helper for memo prop comparison.

  const left = Array.isArray(a) ? a : [];
  const right = Array.isArray(b) ? b : [];

  if (left.length !== right.length) {
    return false;
  }

  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return false;
    }
  }

  return true;
}

function areFiltersPanelPropsEqual(prevProps, nextProps) {

  // FiltersPanel rerenders only when relevant arrays actually change.

  return (
    areArraysEqual(prevProps.contentTypeOptions, nextProps.contentTypeOptions) &&
    areArraysEqual(prevProps.conditionOptions, nextProps.conditionOptions) &&
    areArraysEqual(prevProps.selectedContentTypes, nextProps.selectedContentTypes) &&
    areArraysEqual(prevProps.selectedConditions, nextProps.selectedConditions) &&
    prevProps.onToggleContentType === nextProps.onToggleContentType &&
    prevProps.onToggleCondition === nextProps.onToggleCondition &&
    prevProps.onClearAll === nextProps.onClearAll
  );
}

// Memo comparison to avoid rerenders from unrelated parent updates.

export default React.memo(FiltersPanel, areFiltersPanelPropsEqual);