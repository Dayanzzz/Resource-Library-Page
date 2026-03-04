import React from "react";

function ResourceCard({ resource }) {
  const title = resource?.title ?? "Untitled resource";
  const url = resource?.url ?? "#";
  const excerpt = resource?.excerpt ?? "No summary available.";
  const author = resource?.author ?? "Unknown author";
  const date = resource?.date ?? "Unknown date";
  const contentType = resource?.contentType ?? "Unknown type";
  const condition = resource?.condition ?? "Unspecified";
  const isExternalUrl = typeof url === "string" && /^https?:\/\//i.test(url);

  return (
    <article className="resource-card">
      <div className="card-top-row">
        <span className="badge badge-content">{contentType}</span>
        <span className="badge badge-condition">{condition}</span>
      </div>

      <h3>
        <a href={url} target={isExternalUrl ? "_blank" : undefined} rel="noreferrer">
          {title}
        </a>
      </h3>

      <p className="excerpt">{excerpt}</p>

      <p className="card-meta">
        <span>{author}</span>
        <span aria-hidden="true">•</span>
        <time dateTime={resource?.date ?? ""}>{date}</time>
      </p>
    </article>
  );
}

export default React.memo(ResourceCard);