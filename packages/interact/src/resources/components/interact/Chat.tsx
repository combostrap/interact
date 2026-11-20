"use client"

import * as React from "react"
import {type Message as MessageType, type ToolMessage} from "@ag-ui/core";

import {ChatMessage} from "./ChatMessage.tsx"
import {ChatPrompt} from "./ChatPrompt"
import {ChatStatusIcon} from "./ChatStatusIcon.tsx"
import {ChatSuggestions} from "./ChatSuggestions.tsx"
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert"
import {Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle,} from "@/components/ui/empty"
import {Message, MessageContent} from "@/components/ui/message"
import {
    MessageScroller,
    MessageScrollerButton,
    MessageScrollerContent,
    MessageScrollerItem,
    MessageScrollerProvider,
    MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import {Trace, TraceIcon, TraceLine, TraceTitle} from "@/components/ui/trace"

export function Chat() {

    const messages: MessageType[] = [
        {
            id: "msg_001",
            role: "system",
            content: "You are a helpful assistant with access to a weather tool.",
        },
        {
            id: "msg_002",
            role: "user",
            content: "What's the weather like in The Hague right now?",
        },
        {
            id: "msg_003",
            role: "assistant",
            content: "Let me check that for you.",
            toolCalls: [
                {
                    id: "call_001",
                    type: "function",
                    function: {
                        name: "get_weather",
                        arguments: JSON.stringify({city: "The Hague", unit: "celsius"}),
                    },
                },
            ],
        },
        {
            id: "msg_004",
            role: "tool",
            toolCallId: "call_001",
            content: JSON.stringify({temp: 9, condition: "Light rain", windKmh: 24}),
        },
        {
            id: "msg_005",
            role: "assistant",
            content: "It's 9°C with light rain and a 24 km/h wind. Bring an umbrella!",
        },
        {
            id: "msg_006",
            role: "user",
            content: "Thanks! Will it clear up this evening?",
        },
    ];
    let status = "clean"
    const isBusy = status === "submitted" || status === "streaming"
    const error: { code: number, message: string } = {code: 200, message: ""}

    function sendMessage({text}: { text: string }) {
        console.log(text)
    }

    const toolMessages = messages.filter((m): m is ToolMessage => m.role === "tool");

    return (
        <div className="mx-auto flex min-h-0 w-full flex-1 flex-col">
            {messages.length === 0 ? (
                <div className="flex flex-1 items-center justify-center p-6">
                    <Empty>
                        <EmptyHeader>
                            <EmptyTitle>What can I help with?</EmptyTitle>
                            <EmptyDescription>
                                Start chatting.
                            </EmptyDescription>
                        </EmptyHeader>
                        <EmptyContent>
                            <ChatSuggestions
                                onSelect={(prompt: string) =>
                                    sendMessage(
                                        {text: prompt},
                                    )
                                }
                            />
                        </EmptyContent>
                    </Empty>
                </div>
            ) : (
                <MessageScrollerProvider>
                    <MessageScroller className="flex-1">
                        <MessageScrollerViewport>
                            <MessageScrollerContent className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-6 py-6">
                                {messages.map((message) => (
                                    <MessageScrollerItem
                                        key={message.id}
                                        messageId={message.id}
                                        scrollAnchor={message.role === "user"}
                                    >
                                        <ChatMessage
                                            message={message}
                                            toolMessages={toolMessages}
                                        />
                                    </MessageScrollerItem>
                                ))}
                                {status === "submitted" && (
                                    <MessageScrollerItem messageId="thinking">
                                        <Message>
                                            <MessageContent>
                                                <Trace>
                                                    <TraceLine status="running">
                                                        <TraceIcon>
                                                            <ChatStatusIcon status="running"/>
                                                        </TraceIcon>
                                                        <TraceTitle>Thinking</TraceTitle>
                                                    </TraceLine>
                                                </Trace>
                                            </MessageContent>
                                        </Message>
                                    </MessageScrollerItem>
                                )}
                            </MessageScrollerContent>
                        </MessageScrollerViewport>
                        <MessageScrollerButton/>
                    </MessageScroller>
                </MessageScrollerProvider>
            )}

            <div className="mx-auto flex w-full max-w-2xl flex-col gap-2 px-6 pb-6">
                {error.code != 200 && (
                    <Alert variant="destructive">
                        <AlertTitle>Request failed</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                )}
                <ChatPrompt
                    isBusy={isBusy}
                    onSubmit={(text: string) =>
                        sendMessage({text})
                    }
                    onStop={() => stop()}
                />
            </div>
        </div>
    )
}