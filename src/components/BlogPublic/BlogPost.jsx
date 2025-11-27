import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
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
  const { slug } = useParams(); // <-- use slug instead of id
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        // Query by slug field
        const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
        const snap = await getDocs(q);

        if (snap.empty) {
          setPost(null);
          return;
        }

        const docData = snap.docs[0].data();
        const docId = snap.docs[0].id;

        let createdAt = null;
        if (docData.createdAt?.seconds) {
          createdAt = new Date(docData.createdAt.seconds * 1000);
        } else if (typeof docData.date === "string") {
          createdAt = new Date(docData.date);
        }

        setPost({ id: docId, ...docData, createdAt });
      } catch (err) {
        console.error("Error loading blog post:", err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <div className="blogpost-loading">Loading...</div>;
  if (!post) return <div className="blogpost-notfound">Post not found.</div>;

  const siteUrl = `${window.location.origin}/post/${post.slug}`;
  const description =
    post.excerpt || post.content?.slice(0, 150) || "Blog post content";

  return (
    <>
      <ReadingProgress />

      <Helmet>
        <title>{post.title} | SoleJewels</title>
        <meta name="title" content={post.title} />
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
            description: description,
            image: post.img ? [post.img] : [],
            author: { "@type": "Person", name: "SoleJewels Expert" },
            publisher: {
              "@type": "Organization",
              name: "SoleJewels",
              logo: {
                "@type": "ImageObject",
                url: "https://www.solejewels.store/logo.png"
              }
            },
            datePublished:
              post.createdAt?.toISOString() || new Date().toISOString(),
            mainEntityOfPage: siteUrl
          })}
        </script>
      </Helmet>

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

        {/* <h1 className="blogpost-title">{post.title}</h1> */}

        {post.createdAt && (
          <p className="blogpost-date">
            {post.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric"
            })}
          </p>
        )}

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
              h1: ({ children }) => <h1 className="blogpost-h1">{children}</h1>,
              h2: ({ children }) => <h2 className="blogpost-h2">{children}</h2>,
              h3: ({ children }) => <h3 className="blogpost-h3">{children}</h3>,
              p: ({ children }) => <p className="blogpost-paragraph">{children}</p>,
              blockquote: ({ children }) => (
                <blockquote className="blogpost-blockquote">{children}</blockquote>
              ),
              ul: ({ children }) => <ul className="blogpost-ul">{children}</ul>,
              ol: ({ children }) => <ol className="blogpost-ol">{children}</ol>
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <RelatedPosts category={post.category} currentId={post.id} />
      <PeopleAlsoRead currentId={post.id} currentTitle={post.title} />
    </>
  );
}
