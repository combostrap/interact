import type {LayoutProps} from "@combostrap/interact/types";
import {getInteractConfig} from "@combostrap/interact/config";
import Header from "@/components/partials/Header";
import Body from "@/components/partials/Body";
import Html from "@/components/partials/Html";
import Head from "@/components/partials/Head";
import Aside from "@/components/partials/Aside";
import Hero from "@/components/partials/Hero";
import Toc from "../partials/Toc.js";
import {cn} from "@/lib/utils";
import Footer from "@/components/partials/Footer";
import MainSidebarLayout from "../interact/MainSidebarLayout.tsx";
import OffCanvas from "../interact/OffCanvas.tsx";

/**
 * Holy Layout Components
 */
// noinspection JSUnusedGlobalSymbols - dynamically imported
export default function Holy(layoutProps: LayoutProps) {

    let coreLgClass = cn(
        "lg:grid",
        "lg:grid-cols-[minmax(min-content,1fr)_4fr]",
        "lg:grid-flow-row",
        "lg:gap-4",
        "lg:[grid-template-areas:unset]",
        "lg:mx-4",
        "lg:content-start"
    );
    let asideLgClassName = cn(
        "lg:row-start-1",
        "lg:col-start-1",
        "lg:top-[5rem]",
        "lg:z-[2]",
        "lg:h-fit"
    );
    let mainLgClass = cn(
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
                            <OffCanvas hiddenClass={"lg:hidden"}>
                                <Aside {...layoutProps} className={cn("px-4")}/>
                            </OffCanvas>

                            {/* Regular Aside - visible only at md and above */}
                            <Aside {...layoutProps} className={cn("print:hidden", "hidden md:block")}/>
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
