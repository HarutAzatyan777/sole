import React from "react";
import PostRow from "./PostRow";

export default function PostsTable({
  posts, editId,
  title, setTitle,
  excerpt, setExcerpt,
  content, setContent,
  imageURL, setImageURL,
  published, setPublished,
  handleEdit, handleDelete, movePost
}) {
  return (
    <table className="ba-table">
      <thead>
        <tr>
          <th>Image</th>
          <th>Title</th>
          <th>Excerpt</th>
          <th>Content</th>
          <th>Published</th>
          <th>Actions</th>
          <th>Order</th>
        </tr>
      </thead>
      <tbody>
        {posts.map((post, index) => (
          <PostRow
            key={post.id}
            post={post}
            index={index}
            isEditing={editId === post.id}
            title={title} setTitle={setTitle}
            excerpt={excerpt} setExcerpt={setExcerpt}
            content={content} setContent={setContent}
            imageURL={imageURL} setImageURL={setImageURL}
            published={published} setPublished={setPublished}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            movePost={movePost}
          />
        ))}
      </tbody>
    </table>
  );
}
