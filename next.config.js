const withPlugins = require("next-compose-plugins");
const withPreact = require("next-plugin-preact");
const withPwa = require("next-pwa");

/** @type {import('next').NextConfig} */
const nextConfig = withPlugins([withPreact], {
	reactStrictMode: true,
	poweredByHeader: false,
	env: {
		API: "http://10.12.4.30:8080/api",
	},
	experimental: {
		outputStandalone: true,
	},
	images: {
		loader: "custom",
	},
	amp: true,
});

module.exports = nextConfig;
