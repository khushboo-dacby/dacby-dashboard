/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dacby-database.web.app",
        pathname: "/cdn/**",
      },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/v0/b/dacby-database.appspot.com/o/**",
      },
    ],
  },
};

export default nextConfig;
