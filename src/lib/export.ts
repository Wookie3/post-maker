import html2canvas from "html2canvas";

export type ExportFormat = "png" | "jpeg";

export interface ExportOptions {
  format: ExportFormat;
  quality: number; // 0-1, only for jpeg
  scale: number; // pixel ratio multiplier (2 = retina)
  backgroundColor: string | null;
}

const defaultOptions: ExportOptions = {
  format: "png",
  quality: 0.95,
  scale: 2,
  backgroundColor: null,
};

export async function exportPost(
  element: HTMLElement,
  options: Partial<ExportOptions> = {}
): Promise<Blob> {
  const opts = { ...defaultOptions, ...options };

  const canvas = await html2canvas(element, {
    scale: opts.scale,
    useCORS: true,
    allowTaint: true,
    backgroundColor: opts.backgroundColor ?? undefined,
    logging: false,
    // Remove any selection or focus borders
    onclone: (doc) => {
      const el = doc.querySelector("[data-post-container]");
      if (el) {
        // Remove outline/selection styles for clean export
        (el as HTMLElement).style.outline = "none";
        (el as HTMLElement).style.boxShadow = "none";
      }
    },
  });

  return new Promise((resolve, reject) => {
    const mimeType =
      opts.format === "jpeg" ? "image/jpeg" : "image/png";
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to generate image"));
      },
      mimeType,
      opts.quality
    );
  });
}

export async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(blob: Blob): Promise<boolean> {
  try {
    // Need to use the ClipboardItem API for images
    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob }),
    ]);
    return true;
  } catch {
    return false;
  }
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (n >= 10_000) {
    return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  if (n >= 1_000) {
    return n.toLocaleString();
  }
  return n.toString();
}
