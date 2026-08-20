
/**
 * Deep merge two objects
 * Source wins (The last argument win) in case of conflict on primitive type
 * We use the same order as in an object with ...
 *
 * The library deepmerge would not work on multiple level
 * (ie an object win if present, it does not go behond)
 */
export default function deepMerge(low: any, high: any) {
    if (low == null) return high;
    if (high == null) return low;

    const output = {...low};

    const allKeys = new Set([...Object.keys(low), ...Object.keys(high)]);

    for (const key of allKeys) {
        const inTarget = key in low;
        const inSource = key in high;
        // console.log("Deep Merge on " + key + " (Source: " + inSource + ", target: " + inTarget + ")");
        if (inTarget && inSource) {
            if (low[key] instanceof Object && high[key] instanceof Object) {
                // console.log("Recursive Deep Merge on " + key)
                output[key] = deepMerge(low[key], high[key]);
                continue
            }
            // primitive type, source win
            output[key] = high[key];
            continue;
        }
        if (inSource) {
            output[key] = high[key];
        }
        // if in target, already in
        //output[key] = target[key];
    }

    return output;
}