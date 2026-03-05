
import { useEffect, useState } from "react";


// Key used for localStorage persistence

const SUGGESTED_RESOURCES_STORAGE_KEY = "suggested-resources";


// Reads and parses the initial suggested resources from localStorage.
// Returns an empty array if not in browser or if data is missing/malformed.

function getInitialSuggestedResources() {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(SUGGESTED_RESOURCES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


// Main hook: manages suggestedResources state and syncs it to localStorage.

function useSuggestedResources() {

  // Initialize state from localStorage (once, on mount)

  const [suggestedResources, setSuggestedResources] = useState(getInitialSuggestedResources);

  // Whenever suggestedResources changes, persist to localStorage

  useEffect(() => {
    window.localStorage.setItem(
      SUGGESTED_RESOURCES_STORAGE_KEY,
      JSON.stringify(suggestedResources)
    );
  }, [suggestedResources]);

  // Return state and setter for use in components

  return {
    suggestedResources,
    setSuggestedResources
  };
}

export default useSuggestedResources;

// Returns:
//   suggestedResources: Array of resources loaded from localStorage
//   setSuggestedResources: Setter to update the array