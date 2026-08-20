import {createBuilder, createLogger} from 'vite'
import pc from "picocolors";
import {resolveViteConfig} from "../shared/vite.config.js";
import type {LogLevel} from "../shared/vite.config.js";

export interface BuildActionOptions {
    confPath?: string;
    outDir?: string;
    logLevel?: LogLevel;
}

export async function build({confPath, outDir, logLevel}: BuildActionOptions): Promise<void> {
    try {
        const builder = await createBuilder(await resolveViteConfig({
            confPath,
            outDir,
            logLevel,
            command: 'build'
        }))
        console.log(Object.keys(builder.environments))
        console.log('Interact Build Command: Starting Building')
        // build App will call the environment in order and is equivalent to:
        //   await builder.build(builder.environments.rsc)
        //   await builder.build(builder.environments.ssr)
        //   await builder.build(builder.environments.client)
        // and calling the buildApp Hook (static generation uses this hook)
        await builder.buildApp();
        console.log('Interact Build Command: Build completed successfully!')
    } catch (e) {
        let error = e as Error;
        createLogger('error').error(pc.red(`error when building:\n${error.stack}`), {error: error});
        process.exit(1);
    }
}
