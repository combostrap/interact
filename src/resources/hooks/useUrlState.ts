import {useCallback, useEffect, useState} from "react";

type Serializer<T> = {
    serialize: (value: T) => string;
    deserialize: (raw: string) => T;
};

// Built-in serializers
export const stringSerializer: Serializer<string> = {
    serialize: (v) => v,
    deserialize: (v) => v,
};

// noinspection JSUnusedGlobalSymbols
export const numberSerializer: Serializer<number> = {
    serialize: (v) => String(v),
    deserialize: (v) => Number(v),
};

// noinspection JSUnusedGlobalSymbols
export const booleanSerializer: Serializer<boolean> = {
    serialize: (v) => String(v),
    deserialize: (v) => v === "true",
};

// noinspection JSUnusedGlobalSymbols
export const jsonSerializer = <T>(): Serializer<T> => ({
    serialize: (v) => JSON.stringify(v),
    deserialize: (v) => JSON.parse(v) as T,
});

/**
 * Serializes a Set<string> as a comma-separated string.
 * Empty set → param is removed from URL (equals defaultValue).
 *
 * @example
 * const [selected, setSelected] = useUrlState({
 *   key: "tags",
 *   defaultValue: new Set<string>(),
 *   serializer: stringSetSerializer,
 * });
 *
 * // URL: ?tags=react,typescript,vite
 * // Toggle an item:
 * setSelected(prev => {
 *   const next = new Set(prev);
 *   next.has("react") ? next.delete("react") : next.add("react");
 *   return next;
 * });
 */
export const stringSetSerializer: Serializer<Set<string>> = {
    serialize: (v) => [...v].sort().join(","),
    deserialize: (v) =>
        new Set(v.split(",").map((s) => s.trim()).filter(Boolean)),
};

type UseUrlStateOptions<T> = {
    /** The URL search param key */
    key: string;
    /** Default value when the param is absent */
    defaultValue?: T;
    /** How to convert between T and a URL string */
    serializer?: Serializer<T>;
};

/**
 * Syncs a piece of state with a URL search parameter.
 *
 * @example — simple string
 * const [nodeId, setNodeId] = useUrlState({ key: "nodeId"});
 *
 * @example — number
 * const [page, setPage] = useUrlState({ key: "page", defaultValue: 1, serializer: numberSerializer });
 *
 * @example — json
 * const [filters, setFilters] = useUrlState({
 *   key: "filters",
 *   defaultValue: { status: "all" },
 *   serializer: jsonSerializer(),
 * });
 */
export function useUrlState<T>({
                                   key,
                                   defaultValue = null,
                                   serializer = stringSerializer as unknown as Serializer<T>
                               }: UseUrlStateOptions<T>): [T, (value: T | null) => void] {


    const [state, setState] = useState<T>(defaultValue);

    // Read initial value from URL
    const readFromUrl = useCallback((): T => {
        const url = new URL(window.location.href);
        const raw = url.searchParams.get(key);
        if (raw === null) return defaultValue;
        try {
            return serializer.deserialize(raw);
        } catch {
            return defaultValue;
        }
    }, [key, defaultValue, serializer]);

    const writeToUrl = useCallback((state:T) => {
        const url = new URL(window.location.href);

        const isEmpty =
            state === null ||
            state === undefined ||
            state === defaultValue ||
            (state instanceof Set && state.size === 0);

        if (isEmpty) {
            if (url.searchParams.has(key)) {
                url.searchParams.delete(key);
                // We don't push as it would trigger a rsc fetch
                window.history.replaceState({}, "", url);
            }
            return;
        }

        const serialized = serializer.serialize(state);
        if (url.searchParams.get(key) !== serialized) {
            url.searchParams.set(key, serialized);
            // We don't push as it would trigger a rsc fetch
            window.history.replaceState({}, "", url);
        }
    }, [key, defaultValue, serializer]);

    // Read initial value from URL when mounting
    useEffect(() => {
        let value = readFromUrl()
        setValue(value)
    }, []);

    // Write to URL whenever state changes
    useEffect(() => {
        writeToUrl(state)
    }, [writeToUrl, state]);

    // Sync back when the user navigates (back/forward)
    useEffect(() => {
        const onPopState = () => setState(readFromUrl());
        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, [readFromUrl]);

    const setValue = useCallback(
        (value: T | null) => setState(value ?? defaultValue),
        [defaultValue]
    );

    return [state, setValue];
}