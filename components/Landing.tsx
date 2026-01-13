
import React from 'react';

interface LandingProps {
  onStart: () => void;
  onUpload: (imageData: string) => void;
  error: string | null;
}

export const Landing: React.FC<LandingProps> = ({ onStart, onUpload, error }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpload(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden">
      {/* Background Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full"></div>
      </div>

      <header className="absolute top-8 left-8">
        <h1 className="text-2xl font-black tracking-tighter italic text-white flex items-center gap-2">
          FUCK<span className="text-purple-500">AI</span>
        </h1>
      </header>

      <main className="z-10 text-center max-w-2xl">
        <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6 uppercase">
          SCAN. PDF.<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-500">RESUMA.</span>
        </h2>
        <p className="text-zinc-400 text-lg md:text-xl mb-10 max-w-md mx-auto leading-relaxed">
          Pare de digitar suas notas. Tire uma foto ou suba um arquivo, ganhe um PDF limpo e um resumo sem enrolação em segundos.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={onStart}
            className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 font-bold text-white transition-all duration-200 bg-purple-600 rounded-2xl hover:bg-purple-700 focus:outline-none"
          >
            <span className="relative flex items-center gap-3">
              <i className="fa-solid fa-camera text-xl"></i>
              USAR CÂMERA
            </span>
          </button>

          <label className="group relative w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 font-bold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 cursor-pointer">
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            <span className="relative flex items-center gap-3">
              <i className="fa-solid fa-upload text-xl"></i>
              SUBIR IMAGEM
            </span>
          </label>
        </div>
      </main>

      <footer className="absolute bottom-8 w-full text-center px-6">
        <div className="flex justify-center gap-4 sm:gap-8 text-zinc-600 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-check text-purple-500"></i>
            OCR POTENTE
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-check text-purple-500"></i>
            PDF AUTO
          </div>
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-check text-purple-500"></i>
            BRASILEIRO
          </div>
        </div>
      </footer>
    </div>
  );
};
