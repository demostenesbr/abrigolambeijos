const MAX_SIDE = 1600;
const QUALITY = 0.82;

self.onmessage = async (event: MessageEvent<{ file: File }>) => {
  try {
    const bitmap = await createImageBitmap(event.data.file, { imageOrientation: "from-image" });
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    const canvas = new OffscreenCanvas(Math.round(bitmap.width * scale), Math.round(bitmap.height * scale));
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await canvas.convertToBlob({ type: "image/webp", quality: QUALITY });
    if (blob.type !== "image/webp") throw new Error("WEBP não suportado");

    const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
    const hash = Array.from(new Uint8Array(digest).slice(0, 8), (byte) => byte.toString(16).padStart(2, "0")).join("");
    self.postMessage({ ok: true, fileName: `${hash}.webp`, blob });
  } catch (error) {
    self.postMessage({ ok: false, message: error instanceof Error ? error.message : "Falha na conversão" });
  }
};
