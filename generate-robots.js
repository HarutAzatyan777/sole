import fs from "fs";
import path from "path";

const DOMAIN = "https://www.solejewels.store/"; // ← փոխիր քոնով

const content = `
User-agent: *
Allow: /

Sitemap: ${DOMAIN}/sitemap.xml
Sitemap: ${DOMAIN}/feed.xml
`;

const filePath = path.join(process.cwd(), "public", "robots.txt");
fs.writeFileSync(filePath, content);

console.log("✅ robots.txt generated!");
