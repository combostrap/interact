// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:server-contexts' {

    import type {ComponentType} from "react";

    export function getContextComponents(): ComponentType<{ children: ReactNode }>[]

}