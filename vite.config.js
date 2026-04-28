import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Enable HTTPS with self-signed cert so camera/mic works on network IPs too
    // To use: run `npm run dev` and open https://192.168.x.x:5173
    // Browser will show a warning — click "Advanced > Proceed" once
    https: process.env.VITE_HTTPS === 'true' ? true : false,
    host: true, // expose on network
  }
});
