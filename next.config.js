/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	env: {
		API: "http://localhost:8080/api",
	},
};

module.exports = nextConfig;
