import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";
import path from "path";

const firebaseConfig = {
  apiKey: "AIzaSyD7zFjSnU0W7NBHUup-MxppW1phQthvjuM",
  authDomain: "company-3cdfd.firebaseapp.com",
  projectId: "company-3cdfd",
  storageBucket: "company-3cdfd.firebasestorage.app",
  messagingSenderId: "95330663345",
  appId: "1:95330663345:web:83ebeb3c80945e1bfedb90",
  measurementId: "G-WJFLC6D62Y"
};

// ⚡ Init Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🌍 Your website domain
const DOMAIN = "https://yourdomain.com"; // ← փոխիր քոնով

async function generate() {
  console.log("⏳ Generating sitemap...");

  const postsSnapshot = await getDocs(collection(db, "posts"));
  const urls = [];

  // Static pages
  urls.push(`${DOMAIN}/`);
  urls.push(`${DOMAIN}/blog`);
  urls.push(`${DOMAIN}/contact`);
  urls.push(`${DOMAIN}/about`);

  // Dynamic pages (from Firebase)
  postsSnapshot.forEach((doc) => {
    const postId = doc.id;
    urls.push(`${DOMAIN}/post/${postId}`);
  });

  // Build XML
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  // Write to public folder
  const filePath = path.join(process.cwd(), "public", "sitemap.xml");
  fs.writeFileSync(filePath, xml);

  console.log("✅ sitemap.xml created successfully!");
}

generate();
