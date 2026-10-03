import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';
import type { ServerResponse } from 'node:http';

/**
 * The tool ships as a second HTML entry (app.html) so the marketing page never
 * downloads the render engine. This keeps `/app` working as a clean URL in dev,
 * matching the rewrite declared in vercel.json for production.
 */
const appUrlAlias = (): Plugin => ({
  name: 'clippro-app-url-alias',
  configureServer(server) {
    server.middlewares.use('/app', (_req, res: ServerResponse, next) => {
      if (_req.url && _req.url !== '/' && _req.url !== '/app') {
        return next();
      }
      res.statusCode = 302;
      res.setHeader('Location', '/app.html');
      res.end();
    });
  },
});

export default defineConfig(() => {
  // AI Studio disables HMR during agent edits to prevent flickering.
  const disableHmr = process.env.DISABLE_HMR === 'true';

  return {
    plugins: [react(), tailwindcss(), appUrlAlias()],
    server: {
      hmr: !disableHmr,
      watch: disableHmr ? null : {},
    },
    build: {
      target: 'es2022',
      sourcemap: false,
      rollupOptions: {
        input: {
          landing: 'index.html',
          app: 'app.html',
        },
      },
    },
  };
});