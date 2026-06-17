import {createLogger, preview} from 'vite'
import pc from "picocolors"
import {resolveViteConfig} from "../shared/vite.config.js";
import type {LogLevel} from "../shared/vite.config.js";

export interface PreviewActionOptions {
    confPath?: string;
    logLevel?: LogLevel;
}

export async function previewCommand({confPath, logLevel}: PreviewActionOptions): Promise<void> {
    try {
        const server = await preview(await resolveViteConfig({
            confPath,
            logLevel,
            command: "preview"
        }));
        server.printUrls();
        server.bindCLIShortcuts({print: true});
    } catch (e) {
        let error = e as Error;
        createLogger('error').error(pc.red(`error when starting preview server:\n${error.stack}`), {error: error});
        process.exit(1);
    }
}
