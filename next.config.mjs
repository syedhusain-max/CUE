/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Old single-file address.
    return [
      { source: '/cue.dc', destination: '/', permanent: true },
      { source: '/cue.dc.html', destination: '/', permanent: true },
    ];
  },
  async rewrites() {
    // Live demo pages are static files in public/templates/<id>/index.html.
    return [{ source: '/templates/:id', destination: '/templates/:id/index.html' }];
  },
};

export default nextConfig;
