import Anchor from "@combostrap/interact/components/Anchor";
import React, {type ReactElement} from "react";
import {cn} from "@/lib/utils";
import Arrow from "bootstrap-icons/icons/arrow-right-circle-fill.svg";

export type AnchorSkinnableType = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: 'link' | 'button',
    // so that you can change the background color of the icon
    // example: className={"bg-[hsl(var(--bg-200))]"} iconClass={'text-[hsl(var(--bg-200))]'}
    iconClassName?: string;
};

/**
 * An anchor with button and link variant
 * (add an icon if provided)
 * The button is dynamic meaning that even if the label is bigger
 * than a constrained width, when overflowing,
 * the icon background colour is stretching
 */
// noinspection JSUnusedGlobalSymbols
export default function AnchorSkinnable({
                                            href,
                                            children,
                                            Icon,
                                            target,
                                            iconClassName = 'text-white',
                                            variant = 'link',
                                            ...props
                                        }: AnchorSkinnableType & {
    Icon?: ReactElement
}) {


    let iconProps: React.HTMLAttributes<HTMLSpanElement>;
    let anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = props
    if (variant === 'button') {
        let buttonHeight = "";
        anchorProps = {
            className: cn(`flex items-stretch rounded-lg min-h-8 no-underline gap-2 pr-2 pl-0 border-y-1 border-r-1 border-solid border-primary `, anchorProps.className, buttonHeight),
        }
        iconProps = {
            className: cn(`rounded-l-lg bg-primary px-3 self-stretch flex items-center`,iconClassName),
        }
    } else {
        iconProps = {
            className: "text-primary",
        }
    }
    return (
        <Anchor href={href} {...anchorProps}>
            {Icon && (
                <span {...iconProps}>
                    <span className={"icon w-[1em] h-[1em]"}>{Icon}</span>
                </span>)
            }
            {variant === 'link' && children}
            {variant === 'button' && (
                <div className={"flex flex-row items-center justify-between w-full"}>
                    <span>{children}</span>
                    <Arrow className={"align-bottom text-primary"} width="14"/>
                </div>
            )}
        </Anchor>
    )

}