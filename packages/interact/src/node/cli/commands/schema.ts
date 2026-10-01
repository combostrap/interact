import {z} from 'zod';

import {writeFileSync, mkdirSync} from 'fs'
import {join, resolve} from 'path'
import {JsonConfigSchema} from "../../config/configSchema.js";
// interactConfig should be relative path and not the package.json export as this is used by the client
import {createInteractConfig} from "../../config/interactConfigHandler.js";
import path from "node:path";

export interface SchemaActionOptions {
    targetPath?: string;
    confPath?: string;
}

export async function schema({confPath, targetPath}: SchemaActionOptions): Promise<void> {
    let outputPath = targetPath;
    if (outputPath == null) {
        let outputDir = targetPath;
        if (outputDir == null) {
            if (confPath != null) {
                try {
                    const interactConfigTyped = createInteractConfig(confPath);
                    outputDir = interactConfigTyped.paths.runtimeDirectory
                } catch (_e) {
                    // The configuration file may have an error
                    // We still output otherwise, you can generate and use the schema
                    // to correct the errors
                }
            }
        }
        if (outputDir == null) {
            // the default runtime
            outputDir = resolve(process.cwd(), ".interact")
        }
        outputPath = join(outputDir, 'interact.schema.json')
    }

    // Create output directory if it doesn't exist
    mkdirSync(path.dirname(outputPath), {recursive: true})

    // Generate JSON Schema
    // Why input: ZodDefault is now reflected as optional with io: "input".
    // https://github.com/colinhacks/zod/issues/4134
    const jsonSchema = z.toJSONSchema(JsonConfigSchema, {io: "input"})

    // Write to file
    writeFileSync(outputPath, JSON.stringify(jsonSchema, null, 2))

    console.log(`✓ JSON Schema generated at ${outputPath}`)
}
