import type { Message as AgUiMessage, ToolCall, ToolMessage, ContentPart } from "@ag-ui/core";
import { BrainIcon, WrenchIcon } from "lucide-react";

import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Message, MessageContent } from "@/components/ui/message";
import {
    Trace,
    TraceCollapsible,
    TraceCollapsibleContent,
    TraceCollapsibleTrigger,
    TraceIcon,
    TraceLine,
    TraceTitle,
} from "@/components/ui/trace";
import { cn } from "@/lib/utils";

export interface ChatMessageProps {
    message: AgUiMessage;
    /** Tool results (role "tool"), used to pair each tool call with its output */
    toolMessages?: ToolMessage[];
    className?: string;
}

function tryFormatJson(raw: string): string {
    try {
        return JSON.stringify(JSON.parse(raw), null, 2);
    } catch {
        return raw; // partial JSON while streaming, or plain text
    }
}

function textOf(content: unknown): string {
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        // multimodal user content: keep the text parts only
        return content
            .filter((p) => p?.type === "text")
            .map((p) => p.text)
            .join("\n");
    }
    return "";
}

function Output({ children, error }: { children: string; error?: boolean }) {
    return (
        <pre
            className={cn(
                "mt-2 rounded-md bg-muted p-2 text-xs whitespace-pre-wrap",
                // TraceCollapsibleContent mutes text; keep contrast inside the block
                error ? "text-destructive" : "text-foreground"
            )}
        >
      {children}
    </pre>
    );
}

function contentToString(content: string | ContentPart[]): string {
    if (typeof content === "string") {
        return content;
    }
    return content
        .filter((part): part is Extract<ContentPart, { type: "text" }> => part.type === "text")
        .map((part) => part.text)
        .join("");
}

function ToolCallRow({
                         toolCall,
                         result,
                     }: {
    toolCall: ToolCall;
    result?: ToolMessage;
}) {
    const name = toolCall.function.name;
    const status = !result ? "running" : result.error ? "error" : undefined;
    // Trace guidance: put the state in the title, not only in the color/motion
    const title =
        status === "running"
            ? `Running ${name}`
            : status === "error"
                ? `Failed to run ${name}`
                : `Ran ${name}`;

    return (
        <TraceCollapsible>
            <TraceCollapsibleTrigger>
                <TraceLine status={status}>
                    <TraceIcon>
                        <WrenchIcon />
                    </TraceIcon>
                    <TraceTitle>{title}</TraceTitle>
                </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
                <Output>{tryFormatJson(toolCall.function.arguments)}</Output>
                {result && (
                    <Output error={!!result.error}>
                        {result.error ?? tryFormatJson(contentToString(result.content))}
                    </Output>
                )}
            </TraceCollapsibleContent>
        </TraceCollapsible>
    );
}

function InstructionRow({ role, content }: { role: string; content: string }) {
    return (
        <TraceCollapsible>
            <TraceCollapsibleTrigger>
                <TraceLine>
                    <TraceIcon>
                        <BrainIcon />
                    </TraceIcon>
                    <TraceTitle>{`${role} instructions`}</TraceTitle>
                </TraceLine>
            </TraceCollapsibleTrigger>
            <TraceCollapsibleContent>
                <Output>{content}</Output>
            </TraceCollapsibleContent>
        </TraceCollapsible>
    );
}

export function ChatMessage({
                                message,
                                toolMessages = [],
                                className,
                            }: ChatMessageProps) {
    switch (message.role) {
        case "user":
            return (
                <Message align="end" className={className}>
                    <MessageContent>
                        <Bubble variant="default" align="end">
                            <BubbleContent>{textOf(message.content)}</BubbleContent>
                        </Bubble>
                    </MessageContent>
                </Message>
            );

        case "assistant": {
            const { content, toolCalls } = message;
            return (
                <Message className={className}>
                    <MessageContent>
                        {toolCalls && toolCalls.length > 0 && (
                            <Trace>
                                {toolCalls.map((tc) => (
                                    <ToolCallRow
                                        key={tc.id}
                                        toolCall={tc}
                                        result={toolMessages.find((m) => m.toolCallId === tc.id)}
                                    />
                                ))}
                            </Trace>
                        )}
                        {content && (
                            // ghost = unframed, full width: the docs' pick for assistant text
                            <Bubble variant="ghost">
                                <BubbleContent>{content}</BubbleContent>
                            </Bubble>
                        )}
                    </MessageContent>
                </Message>
            );
        }

        case "system":
        case "developer":
            return (
                <Message className={className}>
                    <MessageContent>
                        <Trace>
                            <InstructionRow role={message.role} content={message.content} />
                        </Trace>
                    </MessageContent>
                </Message>
            );

        case "tool":
            // Normally shown inside the matching assistant tool call via
            // `toolMessages`. Filter these out of your list, or render standalone:
            return (
                <Message className={className}>
                    <MessageContent>
                        <Trace>
                            <TraceCollapsible>
                                <TraceCollapsibleTrigger>
                                    <TraceLine status={message.error ? "error" : undefined}>
                                        <TraceIcon>
                                            <WrenchIcon />
                                        </TraceIcon>
                                        <TraceTitle>
                                            {message.error
                                                ? "Tool call failed"
                                                : "Tool call returned"}
                                        </TraceTitle>
                                    </TraceLine>
                                </TraceCollapsibleTrigger>
                                <TraceCollapsibleContent>
                                    <Output error={!!message.error}>
                                        {message.error ?? tryFormatJson(contentToString(message.content))}
                                    </Output>
                                </TraceCollapsibleContent>
                            </TraceCollapsible>
                        </Trace>
                    </MessageContent>
                </Message>
            );

        default:
            return null; // activity/reasoning messages, etc.
    }
}