import { describe, it, expect } from 'vitest';
import { generatePageModulesCode } from '../src/node/vite/pagesProvider.ts';

describe('generatePageModulesCode', () => {
    it('generates imports and routes for a list of files', () => {
        const code = generatePageModulesCode('/src/pages', [
            'index.mdx',
            'page1.mdx',
            'page2.mdx',
        ]);

        expect(code).toContain('import * as Page0 from "/src/pages/index.mdx"');
        expect(code).toContain('import * as Page1 from "/src/pages/page1.mdx"');
        expect(code).toContain('import * as Page2 from "/src/pages/page2.mdx"');

        expect(code).toContain('"/": { module: Page0, path: "/src/pages/index.mdx" }');
        expect(code).toContain('"/index": { module: Page0, path: "/src/pages/index.mdx" },');
        expect(code).toContain('"/page1": { module: Page1, path: "/src/pages/page1.mdx" },');
        expect(code).toContain('"/page2": { module: Page2, path: "/src/pages/page2.mdx" }');
    });

    it('handles nested pages', () => {
        const code = generatePageModulesCode('/src/pages', ['blog/post1.mdx']);

        expect(code).toContain('import * as Page0 from "/src/pages/blog/post1.mdx"');
        expect(code).toContain('"/blog/post1": { module: Page0, path: "/src/pages/blog/post1.mdx" }');
    });

    it('handles an empty pages directory', () => {
        const code = generatePageModulesCode('/src/pages', []);

        expect(code).toContain('const modulePages = {');
        expect(code).toContain('export default getModulePage');
    });
});