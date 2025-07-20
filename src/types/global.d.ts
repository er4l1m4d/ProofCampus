declare module 'html2canvas' {
  interface Html2CanvasOptions {
    scale?: number;
    useCORS?: boolean;
    allowTaint?: boolean;
    backgroundColor?: string;
    width?: number;
    height?: number;
    scrollX?: number;
    scrollY?: number;
    windowWidth?: number;
    windowHeight?: number;
  }

  interface Html2CanvasInstance {
    (element: HTMLElement, options?: Html2CanvasOptions): Promise<HTMLCanvasElement>;
  }

  const html2canvas: Html2CanvasInstance;
  export default html2canvas;
}

declare module 'jspdf' {
  interface jsPDFOptions {
    orientation?: 'portrait' | 'landscape';
    unit?: 'pt' | 'mm' | 'cm' | 'in';
    format?: string | number[];
  }

  class jsPDF {
    constructor(options?: jsPDFOptions);
    addImage(imageData: string, format: string, x: number, y: number, width: number, height: number): void;
    save(filename: string): void;
    setFontSize(size: number): void;
    text(text: string, x: number, y: number): void;
  }

  export { jsPDF };
} 