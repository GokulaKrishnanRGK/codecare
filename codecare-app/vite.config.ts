import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import {VitePWA} from "vite-plugin-pwa";
import * as fs from "node:fs";


export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), '');

  const port = Number(env.VITE_PORT) || 3002;
  const host = env.VITE_HOST || "thelocaleagle.test";

  return {
    server: {
      port,
      host,
      strictPort: true,
      https: {
        key: fs.readFileSync(env.VITE_SSL_KEY_PATH),
        cert: fs.readFileSync(env.VITE_SSL_CERT_PATH),
      },
      hmr: {
        host,
        protocol: "wss",
        clientPort: port,
      }
    },
    css: {
      devSourcemap: false,
    },
    plugins: [react(),
      VitePWA({
        registerType: "autoUpdate",
        injectRegister: "auto",
        strategies: "generateSW",
        devOptions: {
          enabled: false
        },
        manifest: {
          "name": "Codecare",
          "short_name": "Codecare",
          "start_url": "./",
          "display": "standalone",
          "background_color": "#fff",
          "description": "Codecare App.",
          "theme_color": "#ffffff",
          "icons": [
            {
              "src": "images/pwa-64x64.png",
              "sizes": "64x64",
              "type": "image/png"
            },
            {
              "src": "images/pwa-192x192.png",
              "sizes": "192x192",
              "type": "image/png"
            },
            {
              "src": "images/pwa-512x512.png",
              "sizes": "512x512",
              "type": "image/png"
            },
            {
              "src": "images/maskable-icon-512x512.png",
              "sizes": "512x512",
              "type": "image/png",
              "purpose": "maskable"
            }
          ]
        },
        workbox: {
          disableDevLogs: true,
          runtimeCaching: [
            {
              urlPattern: ({url}) => {
                return url.pathname.includes('images')
              },
              handler: 'CacheFirst',
              method: 'GET',
              options: {
                cacheName: 'static-assets',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24
                },
                cacheableResponse: {
                  statuses: [0, 200]
                },
              }
            },
            {
              urlPattern: ({url}) => {
                return url.pathname.includes('/api/events')
              },
              handler: 'NetworkFirst',
              method: 'GET',
              options: {
                cacheName: 'events-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24
                },
                cacheableResponse: {
                  statuses: [0, 200]
                },
              }
            }
          ]
        }
      })],
  };
});
