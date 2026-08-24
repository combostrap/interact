import type {LayoutProps} from "@combostrap/interact/types";
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "@/components/partials/Header.tsx";
import Body from "@/components/partials/Body.tsx";
import Html from "@/components/partials/Html.tsx";
import Head from "@/components/partials/Head.tsx";
import Aside from "@/components/partials/Aside.tsx";
import Hero from "@/components/partials/Hero.tsx";
import Toc from "../partials/Toc.tsx";
import {cn} from "@/lib/utils.ts";
import Footer from "@/components/partials/Footer.tsx";
import MainSidebarLayout from "../interact/MainSidebarLayout.tsx";

/**
 * Holy Layout Components
 */
// noinspection JSUnusedGlobalSymbols - dynamically imported
export default function Holy(layoutProps: LayoutProps) {

    const coreLgClass = cn(
        "lg:grid",
        "lg:grid-cols-[minmax(min-content,1fr)_4fr]",
        "lg:grid-flow-row",
        "lg:gap-4",
        "lg:[grid-template-areas:unset]",
        "lg:mx-4",
        "lg:content-start"
    );
    const asideLgClassName = cn(
        "lg:row-start-1",
        "lg:col-start-1",
        "lg:top-[5rem]",
        "lg:z-[2]",
        "lg:h-fit"
    );
    const mainLgClass = cn(
        "lg:row-start-1",
        "lg:col-start-2"
    );
    return (
        <Html {...layoutProps}>
            <Head {...layoutProps}/>
            <Body {...layoutProps} className={"layout-holy"}>
                <Header {...layoutProps} />
                <div className={
                    cn(
                        getInteractConfig().template.container.containerClass,
                        "position-relative",
                        "mt-3",
                    )}>
                    <div className={coreLgClass}>
                        <div className={asideLgClassName}>
                            <Aside {...layoutProps}/>
                        </div>

                        <div className={mainLgClass}>
                            <MainSidebarLayout
                                sideBar={
                                    <Toc
                                        {...layoutProps}
                                    />
                                }>
                                <Hero {...layoutProps} />
                                <div className={cn(layoutProps.context.meta.isProsePage && "prose")}>
                                    {layoutProps.page.contentElement}
                                </div>
                            </MainSidebarLayout>
                        </div>

                        <footer id="main-footer" className={
                            cn(
                                "print:hidden"
                            )}>
                        </footer>
                    </div>
                    <Footer {...layoutProps} />
                </div>
            </Body>
        </Html>
    )
}
