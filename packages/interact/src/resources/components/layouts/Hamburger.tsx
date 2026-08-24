import type {LayoutProps} from "@combostrap/interact/types";
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "@/components/partials/Header.tsx";
import Body from "@/components/partials/Body.tsx";
import Html from "@/components/partials/Html.tsx";
import Head from "@/components/partials/Head.tsx";
import {cn} from "@/lib/utils.ts";
import Footer from "@/components/partials/Footer.tsx";

/**
 * Hamburger Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Hamburger(layoutProps: LayoutProps) {

    const interactConfig = getInteractConfig();
    return (
        <Html {...layoutProps}>
            <Head {...layoutProps}/>
            <Body {...layoutProps}>
                <Header {...layoutProps} />
                <div className={
                    cn(
                        interactConfig.template.container.containerClass,
                        "position-relative",
                        layoutProps.context.meta.isProsePage && "prose"
                    )}>
                    <main>
                        {layoutProps.page.contentElement}
                    </main>
                </div>
                <Footer {...layoutProps} />
            </Body>
        </Html>
    )
}
