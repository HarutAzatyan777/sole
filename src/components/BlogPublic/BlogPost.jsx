// ./components/BlogPost/BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet";
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
        let createdAt = null;
        if (data.createdAt?.seconds) {
          createdAt = new Date(data.createdAt.seconds * 1000);
        } else if (typeof data.date === "string") {
          createdAt = new Date(data.date);
        }

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

  if (loading) return <div className="blogpost-loading">Loading...</div>;
  if (!post) return <div className="blogpost-notfound">Post not found.</div>;

  const siteUrl = `${window.location.origin}/post/${post.id}`;
  const description = post.excerpt || post.content?.slice(0, 150) || "Blog post content";

  return (
    <>
      <Helmet>
        <title>{post.title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        {post.img && <meta property="og:image" content={post.img} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        {post.img && <meta name="twitter:image" content={post.img} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            image: post.img ? [post.img] : [],
            author: { "@type": "Person", name: "Your Name" },
            datePublished: post.createdAt?.toISOString() || new Date().toISOString(),
            description: description,
            mainEntityOfPage: siteUrl,
          })}
        </script>
      </Helmet>

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

        <div className="blogpost-content size">
        <ReactMarkdown
  remarkPlugins={[remarkGfm]}
  components={{
    img: ({ src, alt, ...props }) => (
      <img
        src={src}
        alt={alt || "Blog image"}
        className="content-img"
        loading="lazy"
        {...props}
      />
    ),
    h1: ({ children, ...props }) => (
      <h1 {...props} className="blogpost-h1">{children}</h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 {...props} className="blogpost-h2">{children}</h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 {...props} className="blogpost-h3">{children}</h3>
    ),
    p: ({ children, ...props }) => (
      <p {...props} className="blogpost-paragraph">{children}</p>
    ),
    blockquote: ({ children, ...props }) => (
      <blockquote {...props} className="blogpost-blockquote">{children}</blockquote>
    ),
    ul: ({ children, ...props }) => (
      <ul {...props} className="blogpost-ul">{children}</ul>
    ),
    ol: ({ children, ...props }) => (
      <ol {...props} className="blogpost-ol">{children}</ol>
    ),
  }}
>
  {post.content}
</ReactMarkdown>

        </div>
      </article>
    </>
  );
}
