import {PAGE_CONTAINER_CLASS_NAME} from "@/components/classNames.ts";
import {getInteractConfig} from "@combostrap/interact/config";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function StyleLayout() {
    const interactConfig = getInteractConfig();
    const containerMaxWidth = interactConfig.template.container.containerMaxWidth;
    if (containerMaxWidth == undefined) {
        return;
    }
    const layoutStyle = `
.${PAGE_CONTAINER_CLASS_NAME} {
   max-width: ${containerMaxWidth}
}
`
    return (
        <style dangerouslySetInnerHTML={{__html: layoutStyle}}/>
    )
}
