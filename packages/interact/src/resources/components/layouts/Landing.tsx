import type {LayoutProps} from "@combostrap/interact/types";
import Html from "@/components/partials/Html.tsx";
import Head from "@/components/partials/Head.tsx";
import Body from "@/components/partials/Body.tsx";
import Footer from "@/components/partials/Footer.tsx";
import Header from "@/components/partials/Header.tsx";

/**
 * Landing Layout
 */
// noinspection JSUnusedGlobalSymbols - imported dynamically
export default function Landing(layoutProps: LayoutProps) {

    return (
        <Html {...layoutProps}>
            <Head {...layoutProps}/>
            <Body  {...layoutProps}>
                <Header {...layoutProps} />
                <main className={layoutProps.context.meta.isProsePage ? "prose" : ""}>
                    {layoutProps.page.contentElement}
                </main>
                <Footer {...layoutProps} />
            </Body>
        </Html>
    )
}
