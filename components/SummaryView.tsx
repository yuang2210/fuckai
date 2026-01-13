
import React from 'react';

interface SummaryViewProps {
  image: string;
  summary: string;
  pdfBlob: Blob | null;
  onReset: () => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({ image, summary, pdfBlob, onReset }) => {
  const downloadPdf = () => {
    if (!pdfBlob) return;
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fuckai-scan-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const shareSummary = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Resumo FuckAI',
          text: summary,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      navigator.clipboard.writeText(summary);
      alert('Resumo copiado para a área de transferência!');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5 py-4 px-6 flex items-center justify-between">
        <h1 className="text-xl font-black italic">
          RESULTADO FUCK<span className="text-purple-500">AI</span>
        </h1>
        <button 
          onClick={onReset}
          className="text-zinc-400 hover:text-white flex items-center gap-2 font-bold"
        >
          <i className="fa-solid fa-rotate-left"></i>
          NOVO SCAN
        </button>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Image Preview */}
        <div className="space-y-6">
          <div className="bg-zinc-900/50 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <div className="p-4 border-b border-white/5 bg-zinc-900 flex items-center justify-between">
              <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Página Capturada</span>
              {pdfBlob && (
                <button
                  onClick={downloadPdf}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-purple-600/20"
                >
                  <i className="fa-solid fa-file-pdf"></i>
                  BAIXAR PDF
                </button>
              )}
            </div>
            <img src={image} alt="Página Escaneada" className="w-full h-auto" />
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="flex flex-col h-full">
          <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-8 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-2xl font-black text-purple-500 uppercase italic">O Resumo</h3>
               <button 
                onClick={shareSummary}
                className="text-zinc-400 hover:text-white p-2 rounded-lg bg-white/5 transition-all"
               >
                 <i className="fa-solid fa-share-nodes text-lg"></i>
               </button>
            </div>

            <div className="prose prose-invert max-w-none flex-1 overflow-auto text-zinc-300 leading-relaxed text-lg whitespace-pre-wrap">
              {summary}
            </div>

            <div className="mt-8 p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl flex items-start gap-4">
              <i className="fa-solid fa-bolt text-purple-500 mt-1"></i>
              <p className="text-sm text-zinc-400">
                Este resumo foi gerado analisando sua caligrafia. Foca nos conceitos centrais, itens de ação e datas importantes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
