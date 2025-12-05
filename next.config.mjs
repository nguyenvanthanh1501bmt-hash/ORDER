/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'yrnxmwbqfpsalzmrpjvb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/food-images/**',
      },
    ],
  },
};
export default nextConfig;
