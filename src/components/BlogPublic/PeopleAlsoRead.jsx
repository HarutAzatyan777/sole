// ./components/BlogPost/PeopleAlsoRead.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import { db } from "../../firebase";
import "./PeopleAlsoRead.css";

export default function PeopleAlsoRead({ currentId }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const q = query(
          collection(db, "blogPosts"),
          where("published", "==", true),
          limit(10)
        );
        const snap = await getDocs(q);

        const data = snap.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => p.id !== currentId)  
          .slice(0, 4); 

        setPosts(data);
      } catch (err) {
        console.error("Error loading related posts:", err);
      }
    };

    fetchPosts();
  }, [currentId]);

  if (posts.length === 0) return null;

  return (
    <div className="peoplealso-section">
      <h2 className="peoplealso-title">People Also Read</h2>

      <div className="peoplealso-grid">
        {posts.map((post) => (
          <a key={post.id} href={`/post/${post.id}`} className="peoplealso-card">
            {post.img && (
              <div className="peoplealso-img-wrap">
                <img src={post.img} alt={post.title} loading="lazy" />
              </div>
            )}

            <h3 className="peoplealso-card-title">{post.title}</h3>

            <p className="peoplealso-card-excerpt">
              {post.excerpt?.slice(0, 90)}...
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
