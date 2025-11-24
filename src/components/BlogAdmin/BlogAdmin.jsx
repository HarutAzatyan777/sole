import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../firebase";
import "./BlogAdmin.css";
import MarkdownEditor from "./MarkdownEditor";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


export default function BlogAdmin() {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [published, setPublished] = useState(false);
  


  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const [posts, setPosts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all / published / unpublished

  

  // Fetch all posts ordered by 'position'
  const fetchPosts = async () => {
    setFetching(true);
    try {
      const q = query(collection(db, "blogPosts"), orderBy("position", "asc"));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
    setFetching(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDone(false);

    try {
      if (editId) {
        const ref = doc(db, "blogPosts", editId);
        await updateDoc(ref, { title, excerpt, content, img: imageURL, published });
        setEditId(null);
      } else {
        const lastPosition = posts.length > 0 ? posts[posts.length - 1].position || posts.length : 0;
        await addDoc(collection(db, "blogPosts"), {
          title,
          excerpt,
          content,
          img: imageURL,
          published,
          date: new Date().toISOString(),
          createdAt: serverTimestamp(),
          position: lastPosition + 1,
        });
      }

      setTitle("");
      setExcerpt("");
      setContent("");
      setImageURL("");
      setPublished(false);
      setDone(true);
      fetchPosts();
    } catch (err) {
      console.error("Error saving post:", err);
    }

    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, "blogPosts", id));
      fetchPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setImageURL(post.img || "");
    setPublished(post.published || false);
    setEditId(post.id);
  };

  const movePost = async (index, direction) => {
    if (index < 0 || index >= posts.length) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= posts.length) return;

    const postA = posts[index];
    const postB = posts[targetIndex];

    try {
      const refA = doc(db, "blogPosts", postA.id);
      const refB = doc(db, "blogPosts", postB.id);

      await updateDoc(refA, { position: postB.position });
      await updateDoc(refB, { position: postA.position });

      fetchPosts();
    } catch (err) {
      console.error("Error moving post:", err);
    }
  };

  // Filtered posts based on search and published filter
  const filteredPosts = posts.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "published" && p.published) ||
      (filter === "unpublished" && !p.published);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="blog-admin-root">
      <h1 className="ba-title">{editId ? "Edit Blog Post" : "Create New Blog Post"}</h1>

      <form className="ba-form" onSubmit={handleSubmit}>
        <label>Post Title *</label>
        <input type="text" placeholder="Enter title..." value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Excerpt *</label>
        <textarea rows="3" placeholder="Short preview text..." value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />

        <label>Content *</label>
<MarkdownEditor value={content} onChange={setContent} />

        <label>Main Image URL (optional)</label>
        <input type="text" placeholder="https://example.com/image.jpg" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />

        <label className="ba-publish">
          <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
          Publish now
        </label>

        <button className="ba-btn" disabled={loading}>
          {loading ? "Saving..." : editId ? "Update Post" : "Create Post"}
        </button>

        {done && <p className="ba-success">Post saved successfully ✔</p>}
      </form>

      <h2 className="ba-subtitle">All Blog Posts</h2>

      <div className="ba-filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ba-search"
        />

        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="ba-filter">
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      {fetching ? (
        <p>Loading posts...</p>
      ) : filteredPosts.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <table className="ba-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Published</th>
            <th>Actions</th>
            <th>Order</th>
          </tr>
        </thead>
        <tbody>
  {filteredPosts.map((post, index) => {
    const isEditing = editId === post.id;

    return (
      <tr key={post.id}>
        <td>
          {isEditing ? (
            <input
              type="text"
              value={imageURL}
              placeholder="Image URL"
              onChange={(e) => setImageURL(e.target.value)}
            />
          ) : post.img ? (
            <img src={post.img} alt={post.title} className="ba-thumb" />
          ) : (
            "No image"
          )}
        </td>

        <td>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            post.title
          )}
        </td>

        <td>
          {isEditing ? (
            <textarea
              rows="2"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
            />
          ) : (
            post.excerpt
          )}
        </td>

        <td style={{ minWidth: "180px", maxWidth: "400px", width: "auto" }}>
  {isEditing ? (
    <textarea
      rows="4"
      value={content}
      onChange={(e) => setContent(e.target.value)}
    />
  ) : (
    <div className="ba-markdown-preview">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {post.content || "No content provided."}
      </ReactMarkdown>
    </div>
  )}
</td>


        <td>
          {isEditing ? (
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
          ) : post.published ? (
            "Yes"
          ) : (
            "No"
          )}
        </td>

        <td>
          {isEditing ? (
            <>
              <button
                onClick={async () => {
                  try {
                    await updateDoc(doc(db, "blogPosts", post.id), {
                      title,
                      excerpt,
                      content,
                      img: imageURL,
                      published,
                    });
                    setEditId(null);
                    setTitle("");
                    setExcerpt("");
                    setContent("");
                    setImageURL("");
                    setPublished(false);
                    fetchPosts();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setEditId(null);
                  setTitle("");
                  setExcerpt("");
                  setContent("");
                  setImageURL("");
                  setPublished(false);
                }}
              >
                No Save
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleEdit(post)}>Edit</button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this post?")) {
                    handleDelete(post.id);
                  }
                }}
              >
                Delete
              </button>
            </>
          )}
        </td>

        <td>
          <button onClick={() => movePost(index, "up")}>↑</button>
          <button onClick={() => movePost(index, "down")}>↓</button>
        </td>
      </tr>
    );
  })}
</tbody>


      </table>
      
      )}
    </div>
  );
}
