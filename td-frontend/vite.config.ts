import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'; 
// https://vitejs.dev/config/
export default defineConfig({
  base :"/",
  plugins: [
    react({
      // Don't fail build on TypeScript errors
      typescript: {
        ignoreBuildErrors: true,
      },
    }),
    tsconfigPaths()
  ],
  server: {
    port: 5001,
  },
  build: {
    // Continue build even if there are TypeScript errors
    typescript: {
      ignoreBuildErrors: true,
    },
  },
})
