/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    INFURA_ID : "2DGDEMlu5nugwSNhTQgruLSqDvw",
	INFURA_SECRET : "e43956f73a145405fdc7ac39e7d15edc"
  },
  images: {
	domains: [
		'ipfs.io',
		'ipfs.infura.io',
		'statics-mumbai-lens-staging.s3.eu-west-1.amazonaws.com',
		'avatar.tobi.sh',
		'res.cloudinary.com',
		'arweave.net',
		'i2.wp.com',
		'i.kym-cdn.com',
		'gateway.pinata.cloud',
		'lens.infura-ipfs.io',
		""
	]
  }
}

module.exports = nextConfig
