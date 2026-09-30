import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(root, "..");
const out = path.join(projectRoot, "pages-dist");
const base = "/zero-to-build/";

await mkdir(out, { recursive: true });
await cp(path.join(projectRoot, "dist", "client"), out, { recursive: true });

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("pages", Date.now().toString());
const { default: worker } = await import(workerUrl.href);
const response = await worker.fetch(
  new Request(new URL(base, "http://localhost"), { headers: { accept: "text/html" } }),
  {
    ASSETS: {
      fetch: async (request) => {
        const url = new URL(request.url);
        let pathname = decodeURIComponent(url.pathname);
        if (pathname.startsWith(base)) pathname = pathname.slice(base.length);
        pathname = pathname.replace(/^\/+/, "");
        const filePath = path.resolve(projectRoot, "dist", "client", pathname);
        const clientRoot = path.resolve(projectRoot, "dist", "client");
        if (filePath !== clientRoot && !filePath.startsWith(`${clientRoot}${path.sep}`)) {
          return new Response("Not found", { status: 404 });
        }
        try {
          const bytes = await readFile(filePath);
          const ext = path.extname(filePath).toLowerCase();
          const contentTypes = {
            ".css": "text/css; charset=utf-8",
            ".js": "text/javascript; charset=utf-8",
            ".json": "application/json; charset=utf-8",
            ".woff": "font/woff",
            ".woff2": "font/woff2",
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".svg": "image/svg+xml",
          };
          return new Response(bytes, {
            status: 200,
            headers: { "content-type": contentTypes[ext] ?? "application/octet-stream" },
          });
        } catch {
          return new Response("Not found", { status: 404 });
        }
      },
    },
  },
  { waitUntil() {}, passThroughOnException() {} },
);

if (!response.ok) throw new Error(`Static render failed: ${response.status}`);
// Vinext's inline next/font CSS still uses root-relative font URLs even when
// basePath is set. Keep those URLs under the same prefix as the compiled assets.
const html = (await response.text()).replaceAll(
  /(?<![\w/-])\/assets\/_vinext_fonts\//g,
  `${base}assets/_vinext_fonts/`,
);
await writeFile(path.join(out, "index.html"), html, "utf8");
