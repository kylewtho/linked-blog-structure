module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async redirects() {
    return [{ source: "/home", destination: "/", permanent: true }];
  },
};
