/// <reference types="vitest" />
import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import type { UserConfig } from 'vite'
import type { InlineConfig } from 'vitest'

interface VitestConfigExport extends UserConfig {
  test: InlineConfig
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  css: {
    devSourcemap: true
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/setup.ts',
      ],
    },
  }
} as VitestConfigExport)
