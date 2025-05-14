import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Add visualizer plugin in analyze mode
  const plugins = [
    react(),
    mode === 'analyze' && visualizer({
      open: true,
      filename: 'dist/stats.html',
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean);

  return {
    plugins,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      // Increase the chunk size warning limit to reduce noise
      chunkSizeWarningLimit: 1000,
      // Enable minification for better performance
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          // Code splitting configuration
          manualChunks: (id) => {
            // Create separate chunks for major dependencies
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor-react';
              }
              if (id.includes('@supabase')) {
                return 'vendor-supabase';
              }
              if (id.includes('lucide') || id.includes('floating-ui')) {
                return 'vendor-ui';
              }
              if (id.includes('zustand') || id.includes('router')) {
                return 'vendor-state';
              }
              if (id.includes('jspdf') || id.includes('html2canvas')) {
                return 'vendor-pdf';
              }
              // Group remaining node_modules
              return 'vendor';
            }
            // Split app code by major features
            if (id.includes('/components/workshop/')) {
              return 'workshop';
            }
            if (id.includes('/components/auth/')) {
              return 'auth';
            }
            if (id.includes('/services/')) {
              return 'services';
            }
          },
        },
      },
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
    }
  };
})
