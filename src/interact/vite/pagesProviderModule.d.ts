declare module 'interact:page-modules' {
    import {Page} from "@combostrap/interact/types";

    type pageModule = { module: Page, path: string };

    export function getModulePage(opts: {
        path: string;
        notFoundPath?: string;
    }): pageModule | undefined;

    export const modulePages: Record<string, pageModule>;
    export default getModulePage;
}