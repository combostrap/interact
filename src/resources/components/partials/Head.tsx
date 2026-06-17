import type {LayoutProps} from "@combostrap/interact/types";
import React from "react";
import {getHeadComponents} from "interact:heads";

export type HeadProps = React.HTMLAttributes<HTMLHeadElement> & LayoutProps;

// noinspection JSUnusedGlobalSymbols - imported via package.json export
export default function Head(headProps: HeadProps) {

    let {page, context, ...props} = headProps;
    let layoutProps: LayoutProps = {
        page: page,
        context: context
    }
    // noinspection HtmlRequiredTitleElement - in HeadTitle
    return (
        <head {...props}>
            {Object.entries(getHeadComponents()).map(([name, Head]) => (
                <Head key={name} {...layoutProps}/>
            ))}
        </head>
    )
}
