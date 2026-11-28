import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('firebase')) {
                return 'vendor-firebase';
              }
              if (id.includes('katex')) {
                return 'vendor-katex';
              }
              if (id.includes('recharts')) {
                return 'vendor-charts';
              }
              if (id.includes('three') || id.includes('@react-three') || id.includes('postprocessing')) {
                return 'vendor-3d';
              }
              if (id.includes('@mediapipe')) {
                return 'vendor-mediapipe';
              }
              if (
                id.includes('docx') ||
                id.includes('jszip') ||
                id.includes('mammoth') ||
                id.includes('jspdf') ||
                id.includes('html2canvas') ||
                id.includes('html-to-image')
              ) {
                return 'vendor-export';
              }
              if (id.includes('framer-motion') || id.includes('gsap')) {
                return 'vendor-motion';
              }
            }
          },
        },
      },
    },
  };
});
