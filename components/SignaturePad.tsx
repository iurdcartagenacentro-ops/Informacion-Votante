
import React, { useRef, useEffect, useState } from 'react';
import { Eraser, Download, AlignCenter } from 'lucide-react';

interface SignaturePadProps {
  onSave: (dataUrl: string) => void;
  onClear: () => void;
}

const SignaturePad: React.FC<SignaturePadProps> = ({ onSave, onClear }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas resolution
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    // Increased lineWidth for thicker lines
    ctx.lineWidth = 5.0; 
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a'; // slate-900
  }, []);

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent | MouseEvent | TouchEvent): { x: number; y: number } => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setIsEmpty(false);
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();
    const { x, y } = getCoordinates(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    centerSignature();
  };

  const centerSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get image data to find the bounding box
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    
    let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
    let found = false;

    // Scan pixels for non-transparent content
    for (let y = 0; y < canvas.height; y++) {
      for (let x = 0; x < canvas.width; x++) {
        const alpha = data[(y * canvas.width + x) * 4 + 3];
        if (alpha > 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
          found = true;
        }
      }
    }

    if (!found) return;

    // Padding to avoid cutting off stroke edges
    const padding = 15 * window.devicePixelRatio;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX = Math.min(canvas.width, maxX + padding);
    maxY = Math.min(canvas.height, maxY + padding);

    const width = maxX - minX;
    const height = maxY - minY;

    // Create a temporary canvas to hold the trimmed signature
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    tempCtx.drawImage(canvas, minX, minY, width, height, 0, 0, width, height);

    // Clear and redraw centered
    ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset scale temporarily to clear everything
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const destX = (canvas.width - width) / 2;
    const destY = (canvas.height - height) / 2;
    
    ctx.drawImage(tempCanvas, destX, destY);
    
    // Restore scale and lineWidth for potential further drawing
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.lineWidth = 5.0;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    
    onSave(canvas.toDataURL());
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      // Re-apply style after clear
      ctx.lineWidth = 5.0;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0f172a';
      setIsEmpty(true);
      onClear();
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;
    
    const link = document.createElement('a');
    link.download = `firma_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-700">Firma del Votante *</label>
        <div className="flex items-center gap-3">
          <button 
            type="button" 
            onClick={handleDownload}
            disabled={isEmpty}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-blue-600 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <Download className="w-3 h-3" /> Descargar
          </button>
          <button 
            type="button" 
            onClick={handleClear}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors"
          >
            <Eraser className="w-3 h-3" /> Limpiar
          </button>
        </div>
      </div>
      <div className="relative group">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-40 bg-white border-2 border-dashed border-slate-200 rounded-xl cursor-crosshair touch-none group-hover:border-blue-200 transition-all shadow-inner"
        />
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center px-4">
            Dibuje su firma aquí. Se centrará automáticamente al finalizar.
          </div>
        )}
      </div>
    </div>
  );
};

export default SignaturePad;
