// noinspection JSUnusedGlobalSymbols - it's exported

declare module 'interact:heads' {

    import type {ComponentType} from "react";
    import type {LayoutProps} from "@combostrap/interact/types";

    export function getHeadComponents(): ComponentType<LayoutProps>[]

}