/**
 * Implement renderToReadableStream
 * https://react.dev/reference/react-dom/server/renderToReadableStream
 */
import {renderToReadableStream} from '@vitejs/plugin-rsc/rsc'
import {parseRenderRequest} from './request'
import type {RscPayload} from './shared'
/**
 * To import module with glob, the path parameter should be static
 * We shoud use a bootstrap script to generate the Main/App file then
 */
import {App, getStaticPaths} from '../../../apps/app/.interact/App.tsx'

/**
 * We export so that they are in the build bundle
 * for static rendering (SSG)
 */
export {getStaticPaths}

/**
 * Handle a request against vite
 * @param request
 */
export default async function handler(request: Request): Promise<Response> {

    /**
     * Differentiate between:
     * * a browser call after hydration (RSC)
     * * and an initial request (SSR)
     * thanks to a prefix added to the URL by the client
     */
    const renderRequest = parseRenderRequest(request)

    /**
     * Serialize React VDOM to RSC stream
     * The root component should return the entire document including the root <html> tag.
     * See https://react.dev/reference/react-dom/server/renderToReadableStream#usage
     */
    const rscPayload: RscPayload = {
        root: <App url={renderRequest.url}/>
    }
    const rscStream = renderToReadableStream<RscPayload>(rscPayload)

    /**
     * This is a request made our app that asks for (ie the RSC client {@see entry.browser.tsx}
     * (ie as the {@link URL_POSTFIX} in the URL)
     * We send a RSC Payload: a compact binary representation of the rendered React Server Components tree.
     */
    if (renderRequest.isRsc) {
        return new Response(rscStream, {
            headers: {
                'content-type': 'text/x-component;charset=utf-8',
            },
        })
    }

    /**
     * This is not a request made by our client asking for a RSC stream
     * Rendering the stream as HTML
     */
    const ssr = await import.meta.viteRsc.loadModule<typeof import('./entry.ssr')>('ssr', 'index')
    const ssrResult = await ssr.renderHtml(rscStream)

    return new Response(ssrResult.stream, {
        status: ssrResult.status,
        headers: {
            'content-type': 'text/html;charset=utf-8',
        },
    })
}

/**
 * Return both rsc and html streams at once
 * for SSG (static rendering)
 */
export async function handleSsg(request: Request): Promise<{
    html: ReadableStream<Uint8Array>
    rsc: ReadableStream<Uint8Array>
}> {

    const url = new URL(request.url)
    const rscPayload: RscPayload = {root: <App url={url}/>}
    const rscStream = renderToReadableStream<RscPayload>(rscPayload)
    const [rscStream1, rscStream2] = rscStream.tee()

    const ssr = await import.meta.viteRsc.loadModule<typeof import('./entry.ssr')>('ssr', 'index')
    const ssrResult = await ssr.renderHtml(rscStream1, {ssg: true})

    return {html: ssrResult.stream, rsc: rscStream2}
}

if (import.meta.hot) {
    import.meta.hot.accept()
}
