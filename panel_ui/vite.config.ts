import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  build: {
    outDir: '../custom_components/bl_haos/panel_static',
    emptyOutDir: true,
    lib: {
      entry: 'src/media-panel.tsx',
      formats: ['es'],
      fileName: () => 'bl-haos-media-panel.js',
    },
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});