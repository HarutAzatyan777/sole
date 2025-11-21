import React from "react";

export default function PostRow({
  post, index, isEditing,
  title, setTitle,
  excerpt, setExcerpt,
  content, setContent,
  imageURL, setImageURL,
  published, setPublished,
  handleEdit, handleDelete, movePost
}) {
  return (
    <tr key={post.id}>
      <td>{isEditing ? <input value={imageURL} onChange={(e) => setImageURL(e.target.value)} /> : post.img ? <img src={post.img} alt={post.title} className="ba-thumb" /> : "No image"}</td>
      <td>{isEditing ? <input value={title} onChange={(e) => setTitle(e.target.value)} /> : post.title}</td>
      <td>{isEditing ? <textarea rows="2" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /> : post.excerpt}</td>
      <td>{isEditing ? <textarea rows="4" value={content} onChange={(e) => setContent(e.target.value)} /> : post.content}</td>
      <td>{isEditing ? <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} /> : post.published ? "Yes" : "No"}</td>
      <td>
        {isEditing ? (
          <button onClick={() => handleEdit(post)}>Save</button>
        ) : (
          <>
            <button onClick={() => handleEdit(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </>
        )}
      </td>
      <td>
        <button onClick={() => movePost(index, "up")}>↑</button>
        <button onClick={() => movePost(index, "down")}>↓</button>
      </td>
    </tr>
  );
}
