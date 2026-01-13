
import React, { useRef, useState, useEffect, useCallback } from 'react';

interface CameraProps {
  onCapture: (imageData: string) => void;
  onBack: () => void;
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onBack }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
      }
    } catch (err) {
      console.error("Camera error:", err);
      alert("Please allow camera access to use FuckAI.");
      onBack();
    }
  }, [onBack]);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        onCapture(dataUrl);
      }
    }
  };

  const handleManualUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onCapture(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={onBack}
          className="bg-black/40 backdrop-blur-md p-3 rounded-full hover:bg-black/60 transition-colors"
        >
          <i className="fa-solid fa-arrow-left text-white text-xl"></i>
        </button>
      </div>

      <div className="flex-1 relative overflow-hidden bg-zinc-900">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          onCanPlay={() => setIsReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Alignment Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-12">
          <div className="w-full h-full border-2 border-white/20 rounded-2xl relative">
             <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-lg"></div>
             <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-lg"></div>
             <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-lg"></div>
             <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-lg"></div>
          </div>
        </div>

        {/* Capture Buttons */}
        <div className="absolute bottom-10 inset-x-0 flex items-center justify-around px-8">
          <label className="cursor-pointer bg-white/10 backdrop-blur-md p-4 rounded-full hover:bg-white/20 transition-all">
            <i className="fa-solid fa-image text-white text-xl"></i>
            <input type="file" accept="image/*" onChange={handleManualUpload} className="hidden" />
          </label>

          <button
            onClick={capturePhoto}
            disabled={!isReady}
            className={`w-20 h-20 rounded-full border-4 border-white flex items-center justify-center transition-transform active:scale-95 ${!isReady ? 'opacity-50' : 'opacity-100'}`}
          >
            <div className="w-16 h-16 bg-white rounded-full"></div>
          </button>

          <div className="w-14"></div> {/* Spacer */}
        </div>
      </div>
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
