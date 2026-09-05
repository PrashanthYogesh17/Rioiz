import { defineConfig } from 'vite';
import { resolve } from 'path';
import fs from 'fs';

// Blade-compatible partial inclusion plugin for Vite
function bladePartialsPlugin() {
  const partialsDir = resolve(__dirname, 'src/partials');

  function resolveIncludes(html, depth = 0) {
    if (depth > 10) return html;

    // Matches @include('partials.name'), @include("partials.name"),
    // <!-- @include('partials.name') -->, and <!-- @include('partials/name.html') -->
    const includeRegex = /(?:<!--\s*)?@include\(\s*['"](?:partials[\.\/])?([^'"\)]+?)(?:\.html)?['"]\s*\)(?:\s*-->)?/g;

    return html.replace(includeRegex, (match, partialName) => {
      const cleanName = partialName.replace(/\.blade|\.html$/g, '').replace(/\./g, '/');
      const partialPath = resolve(partialsDir, `${cleanName}.html`);

      if (fs.existsSync(partialPath)) {
        const content = fs.readFileSync(partialPath, 'utf-8');
        return resolveIncludes(content, depth + 1);
      } else {
        console.warn(`[blade-partials] Warning: Partial not found at ${partialPath}`);
        return `<!-- [blade-partials: Missing ${partialName}] -->`;
      }
    });
  }

  return {
    name: 'vite-plugin-blade-partials',
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return resolveIncludes(html);
      },
    },
    handleHotUpdate({ file, server }) {
      if (file.includes('/src/partials/') || file.includes('\\src\\partials\\')) {
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    },
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const parsedUrl = new URL(req.url, 'http://localhost');
        let pathname = parsedUrl.pathname;

        // Strip leading /src/pages/ if already present in request
        if (pathname.startsWith('/src/pages/')) {
          return next();
        }

        // Map root / and /index.html to /src/pages/index.html
        if (pathname === '/' || pathname === '/index.html') {
          req.url = '/src/pages/index.html';
          return next();
        }

        // Check if page exists in /src/pages/
        const cleanName = pathname.replace(/^\//, '').replace(/\.html$/, '');
        const targetHtml = resolve(__dirname, 'src/pages', `${cleanName}.html`);
        
        if (fs.existsSync(targetHtml)) {
          req.url = `/src/pages/${cleanName}.html`;
        }

        next();
      });
    },
    closeBundle() {
      // Flatten HTML files from dist/src/pages/ into dist/ root for static hosts & preview
      const distPagesDir = resolve(__dirname, 'dist/src/pages');
      const distDir = resolve(__dirname, 'dist');

      if (fs.existsSync(distPagesDir)) {
        const files = fs.readdirSync(distPagesDir);
        for (const file of files) {
          if (file.endsWith('.html')) {
            const srcPath = resolve(distPagesDir, file);
            let content = fs.readFileSync(srcPath, 'utf-8');
            // Adjust relative paths if any
            const destPath = resolve(distDir, file);
            fs.writeFileSync(destPath, content, 'utf-8');
          }
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [bladePartialsPlugin()],
  server: {
    port: 5173,
    open: false,
  },
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'src/pages/index.html'),
        'products-hub': resolve(__dirname, 'src/pages/products-hub.html'),
        'product-detail': resolve(__dirname, 'src/pages/product-detail.html'),
        pricing: resolve(__dirname, 'src/pages/pricing.html'),
        about: resolve(__dirname, 'src/pages/about.html'),
        contact: resolve(__dirname, 'src/pages/contact.html'),
        faq: resolve(__dirname, 'src/pages/faq.html'),
        'blog-list': resolve(__dirname, 'src/pages/blog-list.html'),
        'blog-post': resolve(__dirname, 'src/pages/blog-post.html'),
        login: resolve(__dirname, 'src/pages/login.html'),
        register: resolve(__dirname, 'src/pages/register.html'),
        'knowledge-base': resolve(__dirname, 'src/pages/knowledge-base.html'),
      },
    },
  },
});
