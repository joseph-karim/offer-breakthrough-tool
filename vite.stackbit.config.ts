import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Simplified Vite config for Stackbit visual editor
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true,
    // Increase the chunk size warning limit to reduce noise
    chunkSizeWarningLimit: 1000,
  },
  server: {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
      credentials: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With'
    },
    // Improve startup performance
    hmr: {
      overlay: false // Disable the HMR overlay to reduce initial load time
    },
    // Optimize for faster startup
    warmup: {
      clientFiles: ['./src/main.tsx', './src/App.tsx']
    }
  },
  // Optimize for faster development
  optimizeDeps: {
    // Force include dependencies that might be missed in the scan
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@supabase/supabase-js'
    ],
    // Skip optimization of rarely used dependencies
    exclude: [
      'jspdf', 
      'html2canvas',
      'react-confetti'
    ]
  },
  // Define environment variables for Stackbit
  define: {
    'import.meta.env.VITE_STACKBIT_EDITOR': JSON.stringify('true'),
  }
})
