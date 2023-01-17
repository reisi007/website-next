

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true
}

const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/,
    options: {
        // If you use remark-gfm, you'll need to use next.config.js
        // as the package is ESM only
        // https://github.com/remarkjs/remark-gfm#install
        remarkPlugins: [import("remark-gfm")],
        rehypePlugins: [],
        // If you use `MDXProvider`, uncomment the following line.
        // providerImportSource: "@mdx-js/react",
    },
})

module.exports = withMDX(nextConfig)
