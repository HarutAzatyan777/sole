import React from "react";

export default function BlogForm({
  title, setTitle,
  excerpt, setExcerpt,
  content, setContent,
  imageURL, setImageURL,
  published, setPublished,
  loading, done,
  handleSubmit
}) {
  return (
    <form className="ba-form" onSubmit={handleSubmit}>
      <label>Post Title *</label>
      <input type="text" placeholder="Enter title..." value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Excerpt *</label>
      <textarea rows="3" placeholder="Short preview text..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />

      <label>Content *</label>
      <textarea rows="8" placeholder="Full article content..." value={content} onChange={(e) => setContent(e.target.value)} required />

      <label>Main Image URL (optional)</label>
      <input type="text" placeholder="https://example.com/image.jpg" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />

      <label className="ba-publish">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Publish now
      </label>

      <button className="ba-btn" disabled={loading}>
        {loading ? "Saving..." : "Save Post"}
      </button>

      {done && <p className="ba-success">Post saved successfully ✔</p>}
    </form>
  );
}
