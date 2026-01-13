
import React, { useState, useEffect } from 'react';
import { Camera } from './components/Camera';
import { SummaryView } from './components/SummaryView';
import { Landing } from './components/Landing';
import { processNotebookPage } from './services/geminiService';
import { generatePDF } from './services/pdfService';

export type AppState = 'landing' | 'camera' | 'processing' | 'result';

export default function App() {
  const [state, setState] = useState<AppState>('landing');
  const [image, setImage] = useState<string | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verifica se a API KEY existe ao carregar
  useEffect(() => {
    if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
      console.error("ERRO: Chave API não encontrada! Configure a variável de ambiente API_KEY.");
      setError("ERRO DE CONFIGURAÇÃO: Chave API não encontrada. Configure as Environment Variables no seu host.");
    }
  }, []);

  const handleCapture = async (imageData: string) => {
    if (!process.env.API_KEY) {
      setError("Configure sua API_KEY para processar imagens.");
      return;
    }

    setImage(imageData);
    setState('processing');
    setIsProcessing(true);
    setError(null);

    try {
      const summaryText = await processNotebookPage(imageData);
      setSummary(summaryText);

      const pdf = await generatePDF(imageData);
      setPdfBlob(pdf);

      setState('result');
    } catch (err) {
      console.error(err);
      setError('A IA deu erro. Verifique sua chave ou a conexão.');
      setState('landing');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setImage(null);
    setSummary('');
    setPdfBlob(null);
    setError(null);
    setState('landing');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-purple-500/30">
      {state === 'landing' && (
        <Landing 
          onStart={() => setState('camera')} 
          onUpload={handleCapture}
          error={error} 
        />
      )}

      {state === 'camera' && (
        <Camera onCapture={handleCapture} onBack={reset} />
      )}

      {state === 'processing' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-purple-500 font-bold">
              AI
            </div>
          </div>
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight uppercase italic">ESCANEANDO...</h2>
          <p className="text-zinc-400 max-w-sm">
            Processando sua página e criando o resumo inteligente.
          </p>
        </div>
      )}

      {state === 'result' && image && (
        <SummaryView 
          image={image} 
          summary={summary} 
          pdfBlob={pdfBlob} 
          onReset={reset} 
        />
      )}
    </div>
  );
}
