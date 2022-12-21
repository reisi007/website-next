/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    images: {
        loader: "custom",
        imageSizes: [400],
        deviceSizes: [700, 1200, 2050],
    },
    env: {
        nextImageExportOptimizer_imageFolderPath: "public/images",
        nextImageExportOptimizer_exportFolderPath: "out",
        nextImageExportOptimizer_quality: 50,
        nextImageExportOptimizer_storePicturesInWEBP: true,

        // If you do not want to use blurry placeholder images, then you can set
        // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
        // `placeholder="empty"` to all <ExportedImage> components.
        //
        // If nextImageExportOptimizer_generateAndUseBlurImages is false and you
        // forget to set `placeholder="empty"`, you'll see 404 errors for the missing
        // placeholder images in the console.
        nextImageExportOptimizer_generateAndUseBlurImages: true,
    },
}

module.exports = nextConfig
