import type { NextConfig } from "next";

// script-src is deliberately omitted: the Kakao Maps SDK loads an external <script src>
// and layout.tsx renders inline JSON-LD, and locking that down needs per-request nonces
// we don't have infra for yet.
const CSP = "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // photos keep their file names across deploys, so browsers may hold them a week and revalidate in the background (PageSpeed "efficient cache policy")
      { source: "/img/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=2592000" }] },
      { source: "/admin", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
    ];
  },
};

export default nextConfig;
