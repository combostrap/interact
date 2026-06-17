import type {LayoutProps} from "@combostrap/interact/types";
import styles from "./holyProse.module.css"

import {getInteractConfig} from "@combostrap/interact/config";
import Header from "@/components/partials/Header";
import Html from "@/components/partials/Html";
import Head from "@/components/partials/Head";
import Body from "@/components/partials/Body";
import Hero from "@/components/partials/Hero";
import Toc from "@/components/partials/Toc";
import {cn} from "@/lib/utils";


/**
 * Holy Layout Components without the sidebar
 */
// noinspection JSUnusedGlobalSymbols -
export default function HolyProse(layoutProps: LayoutProps) {

    return (
        <Html {...layoutProps}>
            <Head {...layoutProps} />
            <Body className={"holy-medium"} {...layoutProps}>
                <Header {...layoutProps} />
                <div id="page-core" className={
                    cn(styles['pageCore'],
                        getInteractConfig().template.container.containerClass,
                        "position-relative mt-3"
                    )}>
                    <main id="page-main"
                          className={cn(styles["pageMain"], layoutProps.context.meta.isProsePage && "prose")}>
                        <div id="main-header" className={styles['mainHeader']}>
                            {layoutProps.page?.frontmatter?.hero != "false" && <Hero {...layoutProps} />}
                        </div>
                        <div id="main-toc" className={styles['mainToc']}>
                            <Toc {...layoutProps} />
                        </div>
                        <div id="main-content" className={styles['mainContent']}>
                            {layoutProps.page.contentElement}
                        </div>
                    </main>
                </div>
            </Body>
        </Html>
    )
}
