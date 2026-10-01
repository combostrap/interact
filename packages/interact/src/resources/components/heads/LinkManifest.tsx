import {getInteractConfig} from "@combostrap/interact/config";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function LinkManifest() {
    const interactConfig = getInteractConfig();
    if (!interactConfig.site.manifest) {
        return;
    }
    return (
        <link rel="manifest" href={interactConfig.site.manifest}/>
    )
}
