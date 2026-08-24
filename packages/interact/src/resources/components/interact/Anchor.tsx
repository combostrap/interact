import React from "react";


// noinspection JSUnusedGlobalSymbols
export default function Anchor({children, title,href, target, ...rest}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {

    if (!target && href != null) {
        if (href.startsWith("http")) {
            target = "_blank";
        }
    }

    if (!title) {
        title = href;
    }

    return (
        <a href={href} title={title} target={target} {...rest}>{children}</a>
    )

}
