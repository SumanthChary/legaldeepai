import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

export type SignaturePadCanvasProps = {
  onChange?: (dataUrl: string | null) => void;
  disabled?: boolean;
  className?: string;
};

export function SignaturePadCanvas({ onChange, disabled, className }: SignaturePadCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(ratio, ratio);
      }
      signaturePadRef.current?.clear();
      setIsEmpty(true);
      onChange?.(null);
    };

    resizeCanvas();

    const signaturePad = new SignaturePad(canvas, {
      minWidth: 0.8,
      maxWidth: 2.5,
      penColor: "#1f2937",
      onEnd: () => {
        const empty = signaturePad.isEmpty();
        setIsEmpty(empty);
        onChange?.(empty ? null : signaturePad.toDataURL("image/png"));
      },
    });

    signaturePadRef.current = signaturePad;

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      signaturePad.off();
      signaturePadRef.current = null;
    };
  }, [onChange]);

  useEffect(() => {
    if (!signaturePadRef.current) return;
    if (disabled) {
      signaturePadRef.current.off();
    } else {
      signaturePadRef.current.on();
    }
  }, [disabled]);

  const handleClear = () => {
    signaturePadRef.current?.clear();
    setIsEmpty(true);
    onChange?.(null);
  };

  return (
    <div className={`w-full border border-purple-200 rounded-xl bg-white shadow-sm ${className ?? ""}`}>
      <canvas ref={canvasRef} className="w-full h-48 rounded-t-xl" />
      <div className="flex items-center justify-between px-4 py-3">
        <span className="text-sm text-muted-foreground">
          {isEmpty ? "Draw your signature" : "Looks good!"}
        </span>
        <button
          type="button"
          onClick={handleClear}
          className="text-sm font-medium text-purple-600 hover:text-purple-700"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
