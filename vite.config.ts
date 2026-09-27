import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { BRAND, SITE_URL } from './src/config.ts'
import { content } from './src/content.ts'

const escape = (s: string) => s.replace(/\u2060/g, '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Fills index.html's %TOKENS% from src/config.ts and src/content.ts, so the name and meta tags have one source. */
function siteMeta(): Plugin {
  const values: Record<string, string> = {
    BRAND,
    SITE_URL,
    SEO_TITLE: content.seo.title,
    SEO_DESCRIPTION: content.seo.description,
    OG_IMAGE_ALT: content.seo.ogImageAlt,
  }
  return {
    name: 'site-meta',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) => html.replace(/%(BRAND|SITE_URL|SEO_TITLE|SEO_DESCRIPTION|OG_IMAGE_ALT)%/g, (_, k: string) => escape(values[k])),
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), siteMeta()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
})
