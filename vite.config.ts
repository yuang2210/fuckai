
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: Use '.' instead of process.cwd() to avoid type issues with process in non-Node environments or misconfigured types.
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY)
    }
  };
});
