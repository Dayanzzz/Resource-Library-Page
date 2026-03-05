import React, { useState } from "react";
import {
  buildSuggestedResource,
  initialSuggestionFormValues,
  validateSuggestion,
  validateSuggestionField
} from "../utils/suggestResourceFormUtils";

function SuggestResourceForm({ onAddSuggestion }) {
  const [values, setValues] = useState(initialSuggestionFormValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasValidationErrors = Object.keys(validateSuggestion(values)).length > 0;

  const onChangeField = (event) => {
    const { name, value } = event.target;

    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const fieldError = validateSuggestionField(name, value, values);

      setErrors((prev) => {
        const nextErrors = { ...prev };

        if (fieldError) {
          nextErrors[name] = fieldError;
        } else {
          delete nextErrors[name];
        }

        return nextErrors;
      });
    }

    if (statusMessage) {
      setStatusMessage("");
    }
  };

  const onBlurField = (event) => {
    const { name, value } = event.target;
    const fieldError = validateSuggestionField(name, value, values);

    setTouched((prev) => ({ ...prev, [name]: true }));

    setErrors((prev) => {
      const nextErrors = { ...prev };

      if (fieldError) {
        nextErrors[name] = fieldError;
      } else {
        delete nextErrors[name];
      }

      return nextErrors;
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = validateSuggestion(values);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    try {
      // Simulated async delay is intentionally used only to demonstrate loading UI behavior.
      // No backend call is made here because this project does not fetch or submit to a server.
      await new Promise((resolve) => {
        window.setTimeout(resolve, 600);
      });

      onAddSuggestion?.(buildSuggestedResource(values));

      setValues(initialSuggestionFormValues);
      setErrors({});
      setTouched({});
      setStatusMessage("Suggestion saved locally on this device.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const excerptLength = values.excerpt.trim().length;

  return (
    <section className="suggest-form" aria-label="Suggest a resource">
      <h2>Suggest a Resource</h2>
      <p className="suggest-form-note">
        This is a local-only form.
      </p>

      <form className="suggest-form-grid" onSubmit={handleSubmit} noValidate>
        <label htmlFor="suggest-title">Title</label>
        <input
          id="suggest-title"
          name="title"
          required
          minLength={3}
          value={values.title}
          onChange={onChangeField}
          onBlur={onBlurField}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? "suggest-title-error" : undefined}
        />
        {errors.title ? (
          <p id="suggest-title-error" className="form-error" role="alert">
            {errors.title}
          </p>
        ) : null}

        <label htmlFor="suggest-url">URL</label>
        <input
          id="suggest-url"
          name="url"
          type="url"
          required
          value={values.url}
          onChange={onChangeField}
          onBlur={onBlurField}
          placeholder="https://example.com"
          aria-invalid={Boolean(errors.url)}
          aria-describedby={errors.url ? "suggest-url-error" : undefined}
        />
        {errors.url ? (
          <p id="suggest-url-error" className="form-error" role="alert">
            {errors.url}
          </p>
        ) : null}

        <label htmlFor="suggest-content-type">Content Type</label>
        <input
          id="suggest-content-type"
          name="contentType"
          required
          value={values.contentType}
          onChange={onChangeField}
          onBlur={onBlurField}
          aria-invalid={Boolean(errors.contentType)}
          aria-describedby={errors.contentType ? "suggest-content-type-error" : undefined}
        />
        {errors.contentType ? (
          <p id="suggest-content-type-error" className="form-error" role="alert">
            {errors.contentType}
          </p>
        ) : null}

        <label htmlFor="suggest-condition">Condition</label>
        <input
          id="suggest-condition"
          name="condition"
          required
          value={values.condition}
          onChange={onChangeField}
          onBlur={onBlurField}
          aria-invalid={Boolean(errors.condition)}
          aria-describedby={errors.condition ? "suggest-condition-error" : undefined}
        />
        {errors.condition ? (
          <p id="suggest-condition-error" className="form-error" role="alert">
            {errors.condition}
          </p>
        ) : null}

        <label htmlFor="suggest-author">Author (optional)</label>
        <input
          id="suggest-author"
          name="author"
          value={values.author}
          onChange={onChangeField}
          onBlur={onBlurField}
          aria-invalid={Boolean(errors.author)}
          aria-describedby={errors.author ? "suggest-author-error" : undefined}
        />
        {errors.author ? (
          <p id="suggest-author-error" className="form-error" role="alert">
            {errors.author}
          </p>
        ) : null}

        <label htmlFor="suggest-excerpt">Excerpt (optional)</label>
        <textarea
          id="suggest-excerpt"
          name="excerpt"
          value={values.excerpt}
          onChange={onChangeField}
          onBlur={onBlurField}
          rows={4}
          maxLength={300}
          aria-invalid={Boolean(errors.excerpt)}
          aria-describedby={errors.excerpt ? "suggest-excerpt-error" : "suggest-excerpt-help"}
        />
        <p id="suggest-excerpt-help" className="form-help">
          {excerptLength}/300 characters
        </p>
        {errors.excerpt ? (
          <p id="suggest-excerpt-error" className="form-error" role="alert">
            {errors.excerpt}
          </p>
        ) : null}

        <button type="submit" className="clear-button" disabled={hasValidationErrors || isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Suggestion"}
        </button>

        {statusMessage ? (
          <p className="form-success" role="status" aria-live="polite">
            {statusMessage}
          </p>
        ) : null}
      </form>
    </section>
  );
}

export default React.memo(SuggestResourceForm);
