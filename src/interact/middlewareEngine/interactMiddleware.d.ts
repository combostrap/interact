import type {Page} from "../pages/interactPage.js";
import type {ReactNode} from "react";

export type MiddlewarePageResponse = {
    status?: number;
    headers?: HeadersInit;
    page: Page
}

export type ReactNodeResponse = {
    status?: number;
    headers?: HeadersInit;
    root: ReactNode
}


type MiddlewareResponseValue =
    | Response
    | (() => Response)
    | (() => Promise<Response>)
    | MiddlewarePageResponse
    | (() => MiddlewarePageResponse)
    | (() => Promise<MiddlewarePageResponse>)

type MiddlewareResult =
    | MiddlewareResponseValue  // short-circuit with a response
    | null                     // pass to next middleware
    | undefined;               // pass to next middleware


export type Middleware = {
    name: string
    handler: MiddlewareHandler
}

export type MiddlewareHandler = (request: Request) => MiddlewareResult | Promise<MiddlewareResult>;

