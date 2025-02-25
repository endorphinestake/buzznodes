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
    DEBUG: process.env.DEBUG,
    API_URL: process.env.API_URL || "https://buzznodes.com",
    GOOGLE_RECAPTCHA_KEY: process.env.GOOGLE_RECAPTCHA_KEY,
    SOCIAL_AUTH_GOOGLE_CLIENT_ID: process.env.SOCIAL_AUTH_GOOGLE_CLIENT_ID,
    TAWK_PROPERY_ID: process.env.TAWK_PROPERY_ID,
    TAWK_WIDGET_ID: process.env.TAWK_WIDGET_ID,
  },
};

module.exports = withTM(nextConfig);
