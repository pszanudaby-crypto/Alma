import os from 'node:os';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const DEV_PORT = 5173;

/** Первый не внутренний IPv4 — для HMR/ассетов при заходе с других ПК по LAN */
function firstLanIPv4() {
  const nets = os.networkInterfaces();
  for (const list of Object.values(nets)) {
    if (!list) continue;
    for (const net of list) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return undefined;
}

/** Переопределение: `set VITE_DEV_SERVER_HOST=192.168.146.136` перед `npm run dev` */
const lanHost = process.env.VITE_DEV_SERVER_HOST || firstLanIPv4();
const lanOrigin = lanHost ? `http://${lanHost}:${DEV_PORT}` : undefined;

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        /** Отдельный парс framer-motion — быстрее первый интерактив на слабых телефонах. */
        manualChunks(id) {
          if (id.includes('node_modules/framer-motion')) return 'framer-motion';
        },
      },
    },
  },
  server: {
    host: true,
    port: DEV_PORT,
    strictPort: true,
    ...(lanOrigin
      ? {
          origin: lanOrigin,
          hmr: {
            host: lanHost,
            port: DEV_PORT,
            clientPort: DEV_PORT,
          },
        }
      : {}),
  },
});
