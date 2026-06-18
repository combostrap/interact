#!/usr/bin/env node
import {cac} from 'cac'
import {build} from './commands/build.js'
import {start} from './commands/start.js'
import {previewCommand} from './commands/preview.js'
import {config} from './commands/config.js'
import {favicon} from './commands/favicon.js'
import {schema} from './commands/schema.js'
import type {LogLevel} from './shared/vite.config.js'
import {version} from '../../../package.json';

const cli = cac('interact')

// Global option shared by every command.
// The default is derived (cli, env or current dir) so no default is set here.
cli.option('--confPath <path>', 'Project root directory or configuration file path')

cli
    .command('build', 'Build project for production')
    .option('--outDir <dir>', 'The output directory', {default: 'dist'})
    .option('--logLevel <level>', 'Specify level for logging (info|warn|error|silent)', {default: 'info'})
    .action(async (options) => {
        await build({
            confPath: options.confPath,
            outDir: options.outDir,
            logLevel: options.logLevel as LogLevel,
        })
    })

cli
    .command('start', 'Start development server')
    .option('--port <port>', 'Dev server port', {default: 5173})
    .option('--outDir <dir>', 'The output directory', {default: 'dist'})
    .option('--logLevel <level>', 'Specify level for logging (info|warn|error|silent)', {default: 'info'})
    .action(async (options) => {
        await start({
            confPath: options.confPath,
            port: Number(options.port),
            outDir: options.outDir,
            logLevel: options.logLevel as LogLevel,
        })
    })

cli
    .command('preview', 'Preview the static build')
    .option('--logLevel <level>', 'Specify level for logging (info|warn|error|silent)', {default: 'info'})
    .action(async (options) => {
        await previewCommand({
            confPath: options.confPath,
            logLevel: options.logLevel as LogLevel,
        })
    })

cli
    .command('config', 'Print the interact configuration (YAML by default)')
    .option('-f, --filter <key>', 'Filter configuration by key path (e.g., "theme.colors")')
    .option('-j, --json', 'Output in JSON format')
    .option('-y, --yaml', 'Output in YAML format (default)')
    .option('--no-pretty', 'Disable colorized output')
    .option('--plain', 'Disable colorized output (alias for --no-pretty)')
    .example('  $ interact config')
    .example('  $ interact config --json')
    .example('  $ interact config --filter theme.colors')
    .example('  $ interact config --json --no-pretty')
    .action(async (options) => {
        await config({
            confPath: options.confPath,
            filter: options.filter,
            json: options.tson,
            yaml: options.yaml,
            // cac maps --no-pretty to options.pretty === false
            noPretty: !options.pretty,
            plain: options.plain,
        })
    })

cli
    .command('favicon [filePath]', 'Generate the favicons and app manifest from a master icon file')
    .option('--dryRun', "Don't create the files")
    .option('-o, --outputDirectory <dir>', 'The output directory (default to the public directory)')
    .example('  $ interact favicon path/to/master-icon.svg')
    .action(async (filePath, options) => {
        await favicon({
            confPath: options.confPath,
            filePath,
            dryRun: options.dryRun,
            outputDirectory: options.outputDirectory,
        })
    })

cli
    .command('schema', 'Generate JSON schema')
    .example('  $ interact schema')
    .action(async (options) => {
        await schema({
            confPath: options.confPath,
        })
    })

cli.help()
cli.version(version)

export async function run(argv: string[] = process.argv): Promise<void> {
    try {
        cli.parse(argv, {run: false})
        // Show help when no command was provided
        if (!cli.matchedCommand) {
            cli.outputHelp()
            return
        }
        await cli.runMatchedCommand()
    } catch (e) {
        const error = e as Error
        console.error(error.message)
        process.exit(1)
    }
}

// Run when executed directly (e.g. via tsx / node).
run()
