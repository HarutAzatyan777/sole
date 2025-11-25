// ./components/BlogPost/BlogPost.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Helmet } from "react-helmet";
import "./BlogPost.css";

import ReadingProgress from "./ReadingProgress";
import ShareButtons from "./ShareButtons";
import RelatedPosts from "./RelatedPosts";
import PeopleAlsoRead from "./PeopleAlsoRead";

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
  const description =
    post.excerpt || post.content?.slice(0, 150) || "Blog post content";

  return (
    <>
      {/* Reading Progress OUTSIDE Helmet */}
      <ReadingProgress />

      <Helmet>
        <title>{post.title} | SoleJewels</title>

        <meta name="title" content={post.title} />
        <meta name="description" content={description} />
        <link rel="canonical" href={siteUrl} />

        {/* --- OpenGraph --- */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={siteUrl} />
        {post.img && <meta property="og:image" content={post.img} />}

        {/* --- Twitter --- */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={description} />
        {post.img && <meta name="twitter:image" content={post.img} />}

        {/* --- Structured Data / JSON-LD --- */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: description,
            image: post.img ? [post.img] : [],
            author: { "@type": "Person", name: "SoleJewels Expert" },
            publisher: {
              "@type": "Organization",
              name: "SoleJewels",
              logo: {
                "@type": "ImageObject",
                url: "https://yourdomain.com/logo.png"
              }
            },
            datePublished:
              post.createdAt?.toISOString() || new Date().toISOString(),
            mainEntityOfPage: siteUrl
          })}
        </script>
      </Helmet>

      {/* Share Buttons */}
      <ShareButtons title={post.title} url={siteUrl} />

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
              day: "numeric"
            })}
          </p>
        )}

        {/* Markdown Content */}
        <div className="blogpost-content size">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              img: ({ src, alt }) => (
                <img
                  src={src}
                  alt={alt || "Blog image"}
                  className="content-img"
                  loading="lazy"
                />
              ),
              h1: ({ children }) => (
                <h1 className="blogpost-h1">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="blogpost-h2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="blogpost-h3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="blogpost-paragraph">{children}</p>
              ),
              blockquote: ({ children }) => (
                <blockquote className="blogpost-blockquote">{children}</blockquote>
              ),
              ul: ({ children }) => (
                <ul className="blogpost-ul">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="blogpost-ol">{children}</ol>
              )
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      {/* Related Posts */}
      <RelatedPosts category={post.category} currentId={post.id} />

      {/* People Also Read */}
      <PeopleAlsoRead currentId={post.id} currentTitle={post.title} />
    </>
  );
}
