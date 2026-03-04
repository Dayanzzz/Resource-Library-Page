import { useCallback, useEffect, useState } from "react";

const initialFilters = {
  contentTypes: [],
  conditions: [],
  search: "",
  sort: "date-desc"
};

const allowedSortValues = new Set(["date-desc", "date-asc", "title-asc", "title-desc"]);

function getFiltersFromUrl() {
  if (typeof window === "undefined") {
    return initialFilters;
  }

  const params = new URLSearchParams(window.location.search);
  const contentTypes = params.getAll("contentType").map((value) => value.trim()).filter(Boolean);
  const conditions = params.getAll("condition").map((value) => value.trim()).filter(Boolean);
  const search = (params.get("search") ?? "").trim();
  const sortParam = params.get("sort") ?? initialFilters.sort;
  const sort = allowedSortValues.has(sortParam) ? sortParam : initialFilters.sort;

  return {
    contentTypes,
    conditions,
    search,
    sort
  };
}

function writeFiltersToUrl(filters) {
  if (typeof window === "undefined") {
    return;
  }

  const params = new URLSearchParams();

  (filters.contentTypes ?? []).forEach((value) => {
    if (value) {
      params.append("contentType", value);
    }
  });

  (filters.conditions ?? []).forEach((value) => {
    if (value) {
      params.append("condition", value);
    }
  });

  if (typeof filters.search === "string" && filters.search.trim()) {
    params.set("search", filters.search.trim());
  }

  if (typeof filters.sort === "string" && filters.sort !== initialFilters.sort) {
    params.set("sort", filters.sort);
  }

  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;

  window.history.replaceState(null, "", nextUrl);
}

function useUrlFilters() {
  const [filters, setFilters] = useState(getFiltersFromUrl);

  useEffect(() => {
    writeFiltersToUrl(filters);
  }, [filters]);

  useEffect(() => {
    const onPopState = () => {
      setFilters(getFiltersFromUrl());
    };

    window.addEventListener("popstate", onPopState);

    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  const clearFilters = useCallback(() => {
    setFilters(initialFilters);
  }, []);

  return {
    filters,
    setFilters,
    clearFilters
  };
}

export default useUrlFilters;
