import type { NextConfig } from "next"

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "crwqvqsyvfubxvpfvubc.supabase.co",
				pathname: "/storage/v1/object/public/apm/**", // Adjust this if your image paths differ
			},
		],
	},
	eslint: { // letak ni
		ignoreDuringBuilds: true,
	},
	typescript: { // letak ni
		ignoreBuildErrors: true,
	},
	output: "standalone",
}

export default nextConfig