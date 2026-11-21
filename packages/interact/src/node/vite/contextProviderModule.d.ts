// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:contexts' {

    import type {ReactNode, ComponentType} from "react";

    export function getContextComponents(): Record<string,ComponentType<{ children: ReactNode }>>

}