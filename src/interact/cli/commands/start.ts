import {createServer} from 'vite'
import {resolveViteConfig} from "../shared/vite.config.js";
import type {LogLevel} from "../shared/vite.config.js";

export interface StartActionOptions {
    confPath?: string;
    outDir?: string;
    logLevel?: LogLevel;
    port?: number;
}

export async function start({confPath, outDir, logLevel, port}: StartActionOptions): Promise<void> {
    let viteConfig = await resolveViteConfig({
        confPath,
        port,
        outDir,
        logLevel,
        command: "start",
    });
    const server = await createServer(viteConfig);
    await server.listen()
    // port may change
    // ie Port 5173 is in use, trying another one...
    console.log(`Starting Interact Dev server`)
    server.printUrls()

    // keep process alive + graceful shutdown
    const shutdown = async () => {
        console.log('\nShutting down Interact Dev server...')
        await server.close()
        process.exit(0)
    }

    process.on('SIGINT', shutdown)
    process.on('SIGTERM', shutdown)
}
