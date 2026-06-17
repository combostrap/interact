import {PAGE_CONTAINER_CLASS_NAME} from "@/components/classNames.js";
import {getInteractConfig} from "@combostrap/interact/config";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function StyleLayout() {
    const interactConfig = getInteractConfig();
    let containerMaxWidth = interactConfig.template.container.containerMaxWidth;
    if (containerMaxWidth == undefined) {
        return;
    }
    let layoutStyle = `
.${PAGE_CONTAINER_CLASS_NAME} {
   max-width: ${containerMaxWidth}
}
`
    return (
        <style dangerouslySetInnerHTML={{__html: layoutStyle}}/>
    )
}
