/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        loader: "custom",
        imageSizes: [20],
        deviceSizes: [400,700, 1200, 2050],
    },
    env: {
        nextImageExportOptimizer_imageFolderPath: "public/images",
        nextImageExportOptimizer_exportFolderPath: "out",
        nextImageExportOptimizer_quality: 50,
        nextImageExportOptimizer_storePicturesInWEBP: true,
    },
}

module.exports = nextConfig
