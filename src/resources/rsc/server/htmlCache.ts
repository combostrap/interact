import fs from "fs";
import path from "path";
import {getInteractConfig} from "../../../interact/config/interactConfig.ts";

function getHtmlCachePaths(sourcePath: string) {
    let interactConfig = getInteractConfig();
    let relativeSourcePath = path.relative(interactConfig.paths.pagesDirectory, sourcePath);
    let relativeTargetPath = relativeSourcePath.slice(0, relativeSourcePath.lastIndexOf(".")) + ".html";
    let targetPath = path.join(interactConfig.paths.htmlCacheDirectory, relativeTargetPath);
    return {
        relativeSourcePath,
        targetPath,
    }
}

export function deleteHtmlCacheEntry(sourcePath: string) {
    let htmlCachePaths = getHtmlCachePaths(sourcePath);
    let cachePath = htmlCachePaths.targetPath;
    if (fs.existsSync(cachePath)) {
        fs.unlinkSync(cachePath)
    }
}

/**
 * Create a static html cache website
 *
 * History:
 * Create first to be used by the vite PageFind plugin in order to update the index in dev mode
 * The vite plugin could intercept the response but the server may respond with rsc format
 * and the transformation to HTML was easier in the handler
 */
export function populateHtmlCache(sourcePath: string, generateDataFn: Function) {


    let cachePaths = getHtmlCachePaths(sourcePath);

    processCache(
        sourcePath,
        cachePaths.targetPath,
        generateDataFn,
    ).then((cacheHit) => {
        if (cacheHit) {
            console.log(`HTML Cache Hit  : ${cachePaths.relativeSourcePath}`)
        } else {
            console.log(`HTML Cache Miss : ${cachePaths.relativeSourcePath}`)
        }
    })
}

/**
 * Reads from cache if valid; otherwise generates new data and overwrites the cache file.
 *
 * @param {string} sourcePath - Path to the original source file.
 * @param {string} cachePath - Path to the cached file.
 * @param {Function} generateDataFn - Async function to produce new data if cache is stale.
 * @returns true if there is a cache hit
 */
async function processCache(sourcePath: string, cachePath: string, generateDataFn: Function): Promise<boolean> {

    if (!fs.existsSync(sourcePath)) {
        throw new Error(`Source file does not exist: ${sourcePath}`);
    }

    let isCacheValid = false;
    if (fs.existsSync(cachePath)) {
        const sourceStat = fs.statSync(sourcePath);
        const cacheStat = fs.statSync(cachePath);
        isCacheValid = cacheStat && cacheStat.mtimeMs >= sourceStat.mtimeMs;
    } else {
        // Ensure the cache file's directory exists before writing
        const cacheDir = path.dirname(cachePath);
        fs.mkdirSync(cacheDir, {recursive: true});
    }

    if (isCacheValid) {
        return true;
    }

    const newData = await generateDataFn();
    fs.writeFileSync(cachePath, newData, 'utf8');
    return false;

}