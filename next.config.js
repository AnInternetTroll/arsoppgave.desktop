/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	env: {
		API: "http://localhost:8000/api",
	},
};

module.exports = nextConfig;
