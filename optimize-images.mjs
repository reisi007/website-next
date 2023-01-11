import {existsSync, promises as fs} from 'fs';
import path from "path";
import sharp from "sharp";

const IMAGE_SIZES = [20, 400, 700, 1200, 2050];

async function checkImage(imageFileName, outFolderName) {
    const origTime = (await fs.stat(imageFileName)).mtime.getTime()
    const allOutImages = IMAGE_SIZES.map(i => {
        const {name} = path.parse(imageFileName)
        return [path.join(outFolderName, `${name}-opt-${i}.WEBP`), i]
    });
    const outImageFiles = await asyncFilter(allOutImages, async ([p]) => {
        const exists = existsSync(p)
        if (!exists) return true;
        const curTime = (await fs.stat(p)).mtime.getTime()
        return curTime < origTime
    })

    for (const e of outImageFiles) {
        const [outFileName, size] = e
        await convertImage(imageFileName, outFileName, size)
    }

}

async function convertFolder(folderName) {

    const inFolder = path.join(process.cwd(), "private", folderName)
    const outFolder = path.join(process.cwd(), "public", folderName)
    const files = await fs.readdir(inFolder)
    for (const file of files) {
        const f = path.join(inFolder, file)
        const lstat = await fs.lstat(f)
        if (lstat.isDirectory()) {
            await convertFolder(`${folderName}/${file}`)
        } else {
            await checkImage(f, outFolder)
        }
    }
}
const asyncFilter = async (arr, predicate) => {
    const results = await Promise.all(arr.map(predicate));
    return arr.filter((_v, index) => results[index]);
}

async function convertImage(inFileName, outFileName, size) {
    const imageBuffer = await fs.readFile(inFileName)

    await sharp(imageBuffer)
        .resize({width: size})
        .webp({quality: 50})
        .toFile(outFileName)
}

console.log("Started analyzing images")

await convertFolder("images")

console.log("Images are optimized")
