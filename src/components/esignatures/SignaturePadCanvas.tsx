import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";

type SignaturePoint = {
  x: number;
  y: number;
  pressure: number;
  time: number;
  color?: string;
};

type SignatureStrokeGroup = SignaturePoint[];
type SignatureData = SignatureStrokeGroup[];

const cloneSignatureData = (data: SignatureData) =>
  data.map((group) => group.map((point) => ({ ...point })));

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
    const canvas = canvasRef.current;
    if (!canvas) return;

    const signaturePad = new SignaturePad(canvas, {
      minWidth: 0.8,
      maxWidth: 2.5,
      penColor: "#1f2937",
    }) as SignaturePad & { onEnd?: () => void };

    const emitChange = () => {
      const empty = signaturePad.isEmpty();
      setIsEmpty(empty);
      onChange?.(empty ? null : signaturePad.toDataURL("image/png"));
    };

  signaturePad.onEnd = emitChange;
    signaturePadRef.current = signaturePad;

    const canvasEvents: Array<keyof HTMLElementEventMap> = ["mouseup", "mouseleave", "touchend", "pointerup"];
    canvasEvents.forEach((eventName) => {
      canvas.addEventListener(eventName, emitChange);
    });

    const resizeCanvas = () => {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const width = canvas.offsetWidth || canvas.clientWidth;
      const height = canvas.offsetHeight || canvas.clientHeight;

  const existingData = signaturePad.isEmpty() ? null : cloneSignatureData(signaturePad.toData() as SignatureData);

      canvas.width = Math.max(width, 1) * ratio;
      canvas.height = Math.max(height, 1) * ratio;
      const context = canvas.getContext("2d");
      if (context) {
        context.scale(ratio, ratio);
      }

      if (existingData && existingData.length > 0) {
        signaturePad.fromData(existingData);
      } else {
        signaturePad.clear();
      }

      emitChange();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvasEvents.forEach((eventName) => {
        canvas.removeEventListener(eventName, emitChange);
      });
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
