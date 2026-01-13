
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Fix: replaced process.cwd() with '.' to resolve TypeScript error regarding the 'cwd' property on the global process object
  // Carrega variáveis de ambiente do arquivo .env ou do sistema
  const env = loadEnv(mode, '.', '');
  
  return {
    plugins: [react()],
    base: './',
    define: {
      // Garante que process.env.API_KEY esteja disponível no código do cliente
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || env.API_KEY || '')
    },
    server: {
      historyApiFallback: true,
    }
  };
});
