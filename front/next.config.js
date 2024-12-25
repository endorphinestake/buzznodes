/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "@patternfly/react-core",
  "@patternfly/react-styles",
]);

const nextConfig = {
  // output: 'export',
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URL: process.env.API_URL || "https://buzznodes.com",
  },
};

module.exports = withTM(nextConfig);
