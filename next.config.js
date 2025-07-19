/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'images.amazon.com',
      'images-na.ssl-images-amazon.com',
      'm.media-amazon.com',
      'media.amazon.com'
    ],
    formats: ['image/webp', 'image/avif'],
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_AMAZON_ASSOCIATE_ID: 'mangacompass-20',
  },
}

module.exports = nextConfig