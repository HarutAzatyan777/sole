import React, { useEffect, useState, useCallback } from "react";
import { db } from "../../firebase";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  getDocs
} from "firebase/firestore";
import { Link } from "react-router-dom";
import "./BlogPublic.css";

const PAGE_SIZE = 6;

const BlogPublic = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState(["all"]);

  // Fetch distinct categories from Firestore
  const fetchCategories = async () => {
    try {
      const q = query(collection(db, "blogPosts"), where("published", "==", true));
      const snapshot = await getDocs(q);
      const catSet = new Set();
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.category) catSet.add(data.category);
      });
      setCategories(["all", ...Array.from(catSet)]);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchPosts = useCallback(async () => {
    if (!hasMore) return;
    try {
      if (lastDoc === "end") return;

      const q = query(
        collection(db, "blogPosts"),
        where("published", "==", true),
        ...(category !== "all" ? [where("category", "==", category)] : []),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE),
        ...(lastDoc ? [startAfter(lastDoc)] : [])
      );

      const snapshot = await getDocs(q);
      if (snapshot.empty) {
        setHasMore(false);
        setLastDoc("end");
        return;
      }

      const newPosts = snapshot.docs.map((doc) => {
        const d = doc.data();
        const createdAt = d.createdAt?.seconds
          ? new Date(d.createdAt.seconds * 1000)
          : d.date
          ? new Date(d.date)
          : null;
        return { id: doc.id, ...d, createdAt };
      });

      setPosts((prev) => [...prev, ...newPosts]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [lastDoc, hasMore, category]);

  useEffect(() => {
    fetchCategories(); // Load categories dynamically
    fetchPosts(); // Load initial posts
  }, [fetchPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 300 &&
        !loadingMore &&
        hasMore
      ) {
        setLoadingMore(true);
        fetchPosts();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchPosts, loadingMore, hasMore]);

  const filteredPosts = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && posts.length === 0)
    return <div className="blog-loading">Loading…</div>;
  if (posts.length === 0) return <div className="blog-empty">No posts yet.</div>;

  return (
    <div className="blog-public-container">
      <h1 className="blog-title">Blog</h1>

      <div className="blog-filters">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="blog-search"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPosts([]);
            setLastDoc(null);
            setHasMore(true);
            setLoading(true);
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="blog-grid">
        {filteredPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {loadingMore && <div className="blog-loading-more">Loading more…</div>}
      {!hasMore && <div className="blog-end">You reached the end</div>}
    </div>
  );
};

const BlogCard = ({ post }) => {
  const snippet =
    post.excerpt || (post.content ? post.content.slice(0, 130) + "..." : "");
  const formattedDate = post.createdAt
    ? post.createdAt.toLocaleDateString("hy-AM", {
        year: "numeric",
        month: "long",
        day: "numeric"
      })
    : "";

  return (
    <Link to={`/blog/${post.slug}`} className="blog-public-card">
      {post.img && (
        <img
          src={post.img}
          alt={post.title || "Blog image"}
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
