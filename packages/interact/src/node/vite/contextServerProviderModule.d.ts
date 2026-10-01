// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:server-contexts' {

    import type {ReactNode, ComponentType} from "react";

    export function getContextComponents(): ComponentType<{ children: ReactNode }>[]

}