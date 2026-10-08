import "@total-typescript/ts-reset";
import { Hono } from "@hono/hono";
import { secureHeaders } from "@hono/hono/secure-headers";
import { serveFile } from "@std/http/file-server";
import { join } from "@std/path";

const root = join(import.meta.dirname as string, "./public");

// TLS is enabled only when both paths are set (production). Locally the server runs over plain HTTP.
const cert = Deno.env.get("TLS_CERT");
const key = Deno.env.get("TLS_KEY");

if (Boolean(cert) !== Boolean(key)) throw new Error("TLS_CERT and TLS_KEY must be set together");

const tls = cert && key ? { cert: Deno.readTextFileSync(cert), key: Deno.readTextFileSync(key) } : null;

// Security headers for every response. Fonts come from Google Fonts.
const headers = secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'none'"],
    scriptSrc: ["'self'"],
    connectSrc: ["'self'"],
    styleSrc: ["'unsafe-inline'", "https://fonts.googleapis.com"],
    fontSrc: ["https://fonts.gstatic.com"],
    imgSrc: ["'self'", "data:"],
    frameAncestors: ["'none'"]
  },
  permissionsPolicy: {
    camera: [],
    microphone: [],
    geolocation: [],
    payment: [],
    usb: [],
    bluetooth: [],
    serial: [],
    hid: [],
    midi: [],
    magnetometer: [],
    gyroscope: [],
    accelerometer: [],
    xrSpatialTracking: [],
    screenWakeLock: [],
    fullscreen: [],
    clipboardRead: [],
    clipboardWrite: [],
    autoplay: [],
    encryptedMedia: [],
    pictureInPicture: [],
    webShare: [],
    browsingTopics: []
  },
  strictTransportSecurity: tls ? "max-age=31536000" : false
});

const app = new Hono();

app.use(headers);

// Asset names contain a content hash (see vite.config.ts), so they can be cached forever.
app.get("/assets/*", async (c) => {
  const path = new URL(c.req.url).pathname;
  const res = await serveFile(c.req.raw, join(root, path));
  res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return res;
});

app.get("*", async (c) => {
  const res = await serveFile(c.req.raw, join(root, "index.html"));
  res.headers.set("Cache-Control", "no-cache");
  return res;
});

Deno.serve({
  ...tls,
  port: tls ? 443 : 4000,
  automaticCompression: true,
  onListen: (args) => console.log({ type: "LISTENING", port: args.port, tls: tls !== null }),
  handler: app.fetch
});

if (tls) {
  Deno.serve({
    port: 80,
    onListen: (args) => console.log({ type: "LISTENING", port: args.port }),
    handler: (req) => Response.redirect(req.url.replace(/^http:/, "https:"), 301)
  });
}
