
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

  // Verificação inicial da API Key
  useEffect(() => {
    const key = process.env.API_KEY;
    console.log("FuckAI: Iniciando aplicação...");
    
    if (!key || key === '' || key === 'undefined') {
      const msg = "CHAVE API AUSENTE: Você precisa configurar a variável de ambiente API_KEY.";
      console.error(msg);
      setError(msg);
    }
  }, []);

  const handleCapture = async (imageData: string) => {
    const key = process.env.API_KEY;
    if (!key || key === '') {
      setError("Ação bloqueada: API_KEY não configurada no ambiente.");
      return;
    }

    setImage(imageData);
    setState('processing');
    setIsProcessing(true);
    setError(null);

    try {
      // Processamento via Gemini
      const summaryText = await processNotebookPage(imageData);
      setSummary(summaryText);

      // Geração do PDF
      const pdf = await generatePDF(imageData);
      setPdfBlob(pdf);

      setState('result');
    } catch (err: any) {
      console.error("Erro no processamento:", err);
      setError(`Erro: ${err.message || 'Falha ao processar imagem. Verifique sua conexão e a validade da API Key.'}`);
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
          <h2 className="text-3xl font-extrabold mb-4 tracking-tight uppercase italic animate-pulse">LENDO SEU CADERNO...</h2>
          <p className="text-zinc-400 max-w-sm">
            A inteligência está decifrando sua letra e preparando o PDF.
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
