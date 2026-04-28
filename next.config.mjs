/** @type {import('next').NextConfig} */

const proxyUrl = process.env.PROXY_URL || "http://localhost:5000";
const nextConfig = {
  /* config options here */
  async rewrites() {
    return {
      afterFiles: [
        {
          source: "/api/:path*",
          destination: `${proxyUrl}/:path*`, // Proxy to Backend
        },
      ],
    };
  },

};



export default nextConfig;
