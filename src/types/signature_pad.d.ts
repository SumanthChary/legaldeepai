declare module "signature_pad" {
  export default class SignaturePad {
    constructor(canvas: HTMLCanvasElement, options?: {
      minWidth?: number;
      maxWidth?: number;
      penColor?: string;
      backgroundColor?: string;
      onBegin?: () => void;
      onEnd?: () => void;
    });
  toData(): unknown[];
  fromData(data: unknown[]): void;
    toDataURL(type?: string, encoderOptions?: number): string;
    clear(): void;
    isEmpty(): boolean;
    off(): void;
    on(): void;
  }
}
