import {getInteractConfig} from "@combostrap/interact/config";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function MetaThemeColor() {
    const interactConfig = getInteractConfig();
    if (!interactConfig.site.colorPrimary) {
        return;
    }
    return (
        <meta name="theme-color" content={interactConfig.site.colorPrimary}/>
    )
}
