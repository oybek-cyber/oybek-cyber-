import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-video-upload',
      configureServer(server) {
        server.middlewares.use('/api/upload-video', (req, res) => {
          if (req.method === 'POST') {
             const urlParams = new URLSearchParams(req.url?.split('?')[1] || '')
             const fileName = urlParams.get('name') || `video_${Date.now()}.mp4`
             // Fayl nomidagi bo'sh joylarni tozalash
             const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
             const filePath = path.join(__dirname, 'public/uploads', safeFileName)
             
             const writeStream = fs.createWriteStream(filePath)
             req.pipe(writeStream)
             
             req.on('end', () => {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ url: `/uploads/${safeFileName}` }))
             })
             
             writeStream.on('error', (err) => {
                res.statusCode = 500
                res.end(JSON.stringify({ error: err.message }))
             })
          } else {
             res.statusCode = 405
             res.end('Method Not Allowed')
          }
        })
      }
    }
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@api': path.resolve(__dirname, './src/api'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@contexts': path.resolve(__dirname, './src/contexts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@i18n': path.resolve(__dirname, './src/i18n'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@services': path.resolve(__dirname, './src/services'),
    },
  },
  server: {
    port: 5173,
    strictPort: false,
  },
  build: {
    target: 'ES2020',
    minify: 'terser',
  },
})
