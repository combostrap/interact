
let pagesDir = '../pages';



export function getStaticPaths() {
  return [...Object.keys(getPages())]
}

/**
 * Load all pages as React component via Vite
 * https://vite.dev/guide/features#glob-import
 **/
export function getPages() {
  let pages = import.meta.glob('../pages/**/*.mdx', {eager: true})
  pages = Object.fromEntries(
      Object.entries(pages).map(([k, v]) => [
        k.slice(pagesDir.length, -'.mdx'.length),
        v,
      ]),
  )
  return pages
}

/**
 * The Root document (React Glossary)
 * is the document including the root <html> tag.
 */
export async function App({ url }: { url: URL }) {
  const pages = getPages()

  async function RootContent() {
    let modulePath= url.pathname
    if (url.pathname === '/') {
      modulePath= "/index"
    }

    const module = pages[modulePath];
    if (!!module) {
      const Component = (module as any).default
      return <Component />
    }

    // TODO: how to 404?
    return <p>Not found</p>
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>RSC MDX SSG</title>
      </head>
      <body>
        <header style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h1>
            <a href="/">RSC + MDX + SSG</a>
          </h1>
          <span data-testid="timestamp">
            Rendered at {new Date().toISOString()}
          </span>
        </header>
        <main>
          <RootContent />
        </main>
      </body>
    </html>
  )
}
