import type {LayoutProps} from "@combostrap/interact/types";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function HeadPageElements({page}: LayoutProps) {
    return page.headElements;
}
