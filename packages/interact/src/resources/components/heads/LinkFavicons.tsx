import {getInteractConfig} from "@combostrap/interact/config";

// noinspection JSUnusedGlobalSymbols - dynamically with the head provider
export default function LinkFavicons() {
    const interactConfig = getInteractConfig();
    if (!interactConfig.site.favicons) {
        return;
    }
    return (
        <>
            {Object.entries(interactConfig.site.favicons).map(([faviconPath, faviconProperties], index) => {
                if (!faviconProperties) {
                    return;
                }
                return (
                    <link
                        key={index}
                        rel={faviconProperties.rel}
                        href={faviconProperties.image?.href ? faviconProperties.image.href : `/${faviconPath}`}
                        {...(faviconProperties.image?.type && {type: faviconProperties.image.type})}
                        {...(faviconProperties.image?.width && faviconProperties.image?.height && {sizes: `${faviconProperties.image.width}x${faviconProperties.image.height}`})}
                        {...(faviconProperties?.as != null && {as: faviconProperties.as})}
                    />
                )
            })}
        </>
    )
}
