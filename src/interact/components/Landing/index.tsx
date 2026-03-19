import type {TemplateProps} from "@combostrap/interact/types";
import {Head, Html, Body} from "interact:components";


/**
 * Landing Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default async function Landing(templateProps: TemplateProps) {
    let Component = templateProps.page.default
    return (
        <Html {...templateProps}>
            <Head {...templateProps}/>
            <Body {...templateProps}>
                <main>
                    <Component request={templateProps.request}/>
                </main>
            </Body>
        </Html>
    )
}
