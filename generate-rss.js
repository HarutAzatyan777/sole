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

const DOMAIN = "https://www.solejewels.store/"; // ← փոխիր

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function generateRSS() {
  console.log("⏳ Generating RSS feed...");

  const postsSnap = await getDocs(collection(db, "posts"));

  let items = "";

  postsSnap.forEach((doc) => {
    const data = doc.data();
    items += `
      <item>
        <title><![CDATA[${data.title}]]></title>
        <link>${DOMAIN}/post/${doc.id}</link>
        <description><![CDATA[${data.excerpt}]]></description>
        <pubDate>${new Date(data.createdAt?.seconds * 1000).toUTCString()}</pubDate>
        <guid>${DOMAIN}/post/${doc.id}</guid>
      </item>
    `;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
      <title>Blog Feed</title>
      <link>${DOMAIN}</link>
      <description>Latest articles</description>
      ${items}
    </channel>
  </rss>`;

  fs.writeFileSync(path.join(process.cwd(), "public", "feed.xml"), xml);

  console.log("✅ RSS feed.xml generated!");
}

generateRSS();
