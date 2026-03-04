export const initialSuggestionFormValues = {
  title: "",
  url: "",
  contentType: "",
  condition: "",
  author: "",
  excerpt: ""
};

export function validateSuggestion(values) {
  const errors = {};
  const title = values.title.trim();
  const url = values.url.trim();
  const contentType = values.contentType.trim();
  const condition = values.condition.trim();
  const author = values.author.trim();
  const excerpt = values.excerpt.trim();

  if (!title) {
    errors.title = "Title is required.";
  } else if (title.length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (!url) {
    errors.url = "URL is required.";
  } else if (!/^https?:\/\/\S+$/i.test(url)) {
    errors.url = "Enter a valid URL starting with http:// or https://.";
  }

  if (!contentType) {
    errors.contentType = "Content type is required.";
  }

  if (!condition) {
    errors.condition = "Condition is required.";
  }

  if (author && author.length < 2) {
    errors.author = "Author must be at least 2 characters if provided.";
  }

  if (excerpt && excerpt.length > 300) {
    errors.excerpt = "Excerpt must be 300 characters or fewer.";
  }

  return errors;
}

export function validateSuggestionField(name, value, allValues) {
  const nextValues = {
    ...allValues,
    [name]: value
  };

  const allErrors = validateSuggestion(nextValues);
  return allErrors[name];
}

export function buildSuggestedResource(values) {
  const createdAt = new Date().toISOString().slice(0, 10);

  return {
    id: `suggested-${Date.now()}`,
    title: values.title.trim(),
    url: values.url.trim(),
    excerpt: values.excerpt.trim() || "No summary available.",
    author: values.author.trim() || "Community submission",
    contentType: values.contentType.trim(),
    condition: values.condition.trim(),
    date: createdAt
  };
}
