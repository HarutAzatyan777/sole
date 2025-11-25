import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { collection, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function PostsList() {
  const [posts, setPosts] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async () => {
    let q;

    if (lastDoc) {
      q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(6)
      );
    } else {
      q = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(6)
      );
    }

    const snapshot = await getDocs(q);

    const newPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(prev => [...prev, ...newPosts]);

    const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    setLastDoc(lastVisible);

    if (snapshot.docs.length < 6) setHasMore(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchPosts}
      hasMore={hasMore}
      loader={<p>Loading...</p>}
      endMessage={<p>No more posts</p>}
    >
      {posts.map(post => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>{post.excerpt}</p>
        </div>
      ))}
    </InfiniteScroll>
  );
}
