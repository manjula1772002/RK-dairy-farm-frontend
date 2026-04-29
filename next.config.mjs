/** @type {import('next').NextConfig} */
// const proxyUrl = process.env.PROXY_URL || "http://localhost:5000";

const nextConfig = {
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*",
  //       destination: `${proxyUrl}/api/:path*`, // Proxy to Backend
  //     },
  //   ];
  // },
};

export default nextConfig;
