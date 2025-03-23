/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          // Your existing patterns here...
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
          },
          {
            protocol: 'https',
            hostname: 'images.clerk.dev',
          },
        ],
      },
};



export default nextConfig;
