// ./components/BlogPublic/BlogPublic.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./BlogPublic.css";

const BlogPublic = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Query only published posts, ordered by createdAt descending
        const q = query(
          collection(db, "blogPosts"),
          where("published", "==", true),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);
        const data = snap.docs.map((doc) => {
          const d = doc.data();
          const createdAt = d.createdAt?.seconds
            ? new Date(d.createdAt.seconds * 1000)
            : d.date
            ? new Date(d.date)
            : null;

          return {
            id: doc.id,
            ...d,
            createdAt,
          };
        });

        setPosts(data);
      } catch (err) {
        console.error("Error loading public blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) return <div className="blog-loading">Loading…</div>;
  if (posts.length === 0) return <div className="blog-empty">No published posts.</div>;

  return (
    <div className="blog-public-container">
      <h1 className="blog-title">Blog</h1>

      <div className="blog-grid">
        {posts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

// Separate BlogCard component for modularity
const BlogCard = ({ post }) => {
  const snippet =
    post.excerpt || (post.content ? post.content.slice(0, 130) + "..." : "");

  const formattedDate = post.createdAt
    ? post.createdAt.toLocaleDateString("hy-AM", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <Link to={`/blog/${post.id}`} className="blog-public-card">
      {post.img && (
        <img
          src={post.img}
          alt={post.title}
          className="blog-public-thumb"
          loading="lazy"
        />
      )}
      <div className="blog-public-content">
        <h2>{post.title}</h2>
        <p className="blog-snippet">{snippet}</p>
        <div className="blog-meta">
          <span className="blog-author">{post.author || "Sole Jewelry"}</span>
          <span className="blog-date">{formattedDate}</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogPublic;
