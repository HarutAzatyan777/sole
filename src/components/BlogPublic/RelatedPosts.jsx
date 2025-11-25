import React, { useEffect, useState } from "react";
import { collection, query, where, limit, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "./RelatedPosts.css";

export default function RelatedPosts({ category, currentId }) {
  const [related, setRelated] = useState([]);

  useEffect(() => {
    const loadRelated = async () => {
      try {
        if (!category) return;

        let q = query(
          collection(db, "blogPosts"),
          where("category", "==", category),
          limit(3)
        );

        const snap = await getDocs(q);

        const posts = snap.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== currentId);

        setRelated(posts);
      } catch (err) {
        console.error("Related posts error:", err);
      }
    };

    loadRelated();
  }, [category, currentId]);

  if (!related.length) return null;

  return (
    <div className="related-wrapper">
      <h2 className="related-title">Related Posts</h2>
      <div className="related-grid">
        {related.map(post => (
          <a key={post.id} href={`/post/${post.id}`} className="related-card">
            {post.img && <img src={post.img} alt={post.title} loading="lazy" />}
            <h3>{post.title}</h3>
          </a>
        ))}
      </div>
    </div>
  );
}
