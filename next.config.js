/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      use: "raw-loader",
    });
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',      
        destination: '/projects', 
        permanent: true, 
      },
    ];
  },
}

module.exports = nextConfig