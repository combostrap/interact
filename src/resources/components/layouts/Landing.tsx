import type {LayoutProps} from "@combostrap/interact/types";
import Html from "@/components/partials/Html";
import Head from "@/components/partials/Head";
import Body from "@/components/partials/Body";
import Footer from "@/components/partials/Footer";
import Header from "@/components/partials/Header";

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
