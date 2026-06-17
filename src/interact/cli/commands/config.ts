import yaml from 'yaml'
import {createInteractConfig} from "../../config/interactConfigHandler.js";

export interface ConfigActionOptions {
    confPath?: string;
    filter?: string;
    json?: boolean;
    yaml?: boolean;
    /** Disable colorized output */
    noPretty?: boolean;
    /** Disable colorized output (alias for noPretty) */
    plain?: boolean;
}

/**
 * Recursively filters an object by a key path
 * @param obj - The object to filter
 * @param filterKey - The key to filter by (supports nested paths like 'theme.colors')
 * @returns The filtered object or undefined if not found
 */
function filterByKey(obj: any, filterKey: string): any {
    if (!filterKey) return obj

    const keys = filterKey.split('.')
    let current = obj

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key]
        } else {
            return undefined
        }
    }

    return current
}

/**
 * Adds ANSI color codes to JSON string for pretty printing
 */
function colorizeJson(jsonString: string): string {
    const colors = {
        reset: '\x1b[0m',
        key: '\x1b[36m',      // Cyan
        string: '\x1b[32m',   // Green
        number: '\x1b[33m',   // Yellow
        boolean: '\x1b[35m',  // Magenta
        null: '\x1b[90m',     // Gray
    }

    return jsonString
        .replace(/("([^"\\]|\\.)*")(\s*:)/g, `${colors.key}$1${colors.reset}$3`) // Keys
        .replace(/:\s*"([^"\\]|\\.)*"/g, (match) => match.replace(/"([^"\\]|\\.)*"/, `${colors.string}"$1"${colors.reset}`)) // String values
        .replace(/:\s*(-?\d+\.?\d*)/g, `:\x1b[33m$1${colors.reset}`) // Numbers
        .replace(/:\s*(true|false)/g, `:\x1b[35m$1${colors.reset}`) // Booleans
        .replace(/:\s*null/g, `:\x1b[90mnull${colors.reset}`) // null
}

/**
 * Adds ANSI color codes to YAML string for pretty printing
 */
function colorizeYaml(yamlString: string): string {
    const colors = {
        reset: '\x1b[0m',
        key: '\x1b[36m',      // Cyan
        string: '\x1b[32m',   // Green
        number: '\x1b[33m',   // Yellow
        boolean: '\x1b[35m',  // Magenta
        null: '\x1b[90m',     // Gray
    }

    return yamlString
        .split('\n')
        .map(line => {
            // Key: value pairs
            if (line.match(/^(\s*)([^:]+):\s*(.+)$/)) {
                return line.replace(/^(\s*)([^:]+):\s*(.+)$/, (_, indent, key, value) => {
                    let coloredValue = value
                    // Color values based on type
                    if (value.match(/^['"].*['"]$/)) {
                        coloredValue = `${colors.string}${value}${colors.reset}`
                    } else if (value.match(/^-?\d+\.?\d*$/)) {
                        coloredValue = `${colors.number}${value}${colors.reset}`
                    } else if (value.match(/^(true|false)$/)) {
                        coloredValue = `${colors.boolean}${value}${colors.reset}`
                    } else if (value.match(/^null$/)) {
                        coloredValue = `${colors.null}${value}${colors.reset}`
                    }

                    return `${indent}${colors.key}${key}${colors.reset}: ${coloredValue}`
                })
            }

            // Keys without values (object headers)
            if (line.match(/^(\s*)([^:]+):$/)) {
                return line.replace(/^(\s*)([^:]+):$/, `$1${colors.key}$2${colors.reset}:`)
            }

            return line
        })
        .join('\n')
}

export async function config(options: ConfigActionOptions): Promise<void> {
    // Determine format
    const format = options.json ? 'json' : 'yaml'
    const pretty = !options.noPretty && !options.plain && process.stdout.isTTY

    let configToPrint = createInteractConfig(options.confPath);
    if (options.filter) {
        const filtered = filterByKey(configToPrint, options.filter)
        if (filtered === undefined) {
            throw new Error(`Key '${options.filter}' not found in configuration`)
        }
        configToPrint = filtered
    }

    let output: string

    if (format === 'json') {
        // JSON output
        output = JSON.stringify(configToPrint, null, 2)
        if (pretty) {
            output = colorizeJson(output)
        }
    } else {
        // YAML output (default)
        output = yaml.stringify(configToPrint)
        if (pretty) {
            output = colorizeYaml(output)
        }
    }

    console.log(output)
}
