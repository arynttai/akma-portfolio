/** Prefix for static files when the site lives under a sub-path (GitHub Pages: /akma-portfolio). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || ''
export const asset = (path: string) => BASE + path
