import React from "react";

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
}) {
  return (
    <>
      <title>{title}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* OpenGraph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="article" />

      {/* Twitter */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </>
  );
}
