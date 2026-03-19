import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Vite mặc định thường nhận asset theo extension viết thường (.jpg, .png...),
  // nên file ảnh viết hoa `.JPG` đôi khi bị import-analysis coi như JS module.
  // Thêm assetsInclude để Vite coi `.JPG` là asset ảnh.
  assetsInclude: ['**/*.JPG'],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
