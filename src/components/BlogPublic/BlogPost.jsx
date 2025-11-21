// ./components/BlogPost/BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import "./BlogPost.css";

export default function BlogPost() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const ref = doc(db, "blogPosts", id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) {
          setPost(null);
          return;
        }

        const data = snapshot.data();

        // Handle createdAt timestamp from Firestore or fallback to string date
        const createdAt =
          data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000)
            : data.date
            ? new Date(data.date)
            : null;

        setPost({ id: snapshot.id, ...data, createdAt });
      } catch (err) {
        console.error("Error loading blog post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading)
    return <div className="blogpost-loading">Loading...</div>;

  if (!post)
    return <div className="blogpost-notfound">Post not found.</div>;

  return (
    <article className="blogpost-container">
      {post.img && (
        <img
          src={post.img}
          alt={post.title}
          className="blogpost-cover"
          loading="lazy"
        />
      )}

      <h1 className="blogpost-title">{post.title}</h1>

      {post.createdAt && (
        <p className="blogpost-date">
          {post.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      <div
        className="blogpost-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
