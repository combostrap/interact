import {getInteractConfig} from "@combostrap/interact/config";


export default async function Footer() {
    const interactConfig = getInteractConfig();
    return (
        <div className={interactConfig.template.container.containerClass}/>
    )
}