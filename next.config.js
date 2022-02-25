/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	env: {
		API: "http://10.12.4.30:8080/api",
	},
	experimental: {
		outputStandalone: true,
	},
};

module.exports = nextConfig;
