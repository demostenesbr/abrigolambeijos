import { useState } from "react";

const MAX_SIDE = 1600;
const QUALITY = 0.82;

interface ConvertedPhoto {
  fileName: string;
  blob: Blob;
  previewUrl: string;
}

interface PetPhotoConverterProps {
  onConverted?: (fileName: string) => void;
}

async function toHashedWebp(file: File): Promise<ConvertedPhoto> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/webp", QUALITY));
  if (!blob || blob.type !== "image/webp") throw new Error("Este navegador não consegue gerar WEBP.");

  const digest = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
  const hash = Array.from(new Uint8Array(digest).slice(0, 8), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return { fileName: `${hash}.webp`, blob, previewUrl: URL.createObjectURL(blob) };
}

export default function PetPhotoConverter({ onConverted }: PetPhotoConverterProps) {
  const [photo, setPhoto] = useState<ConvertedPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    try {
      const converted = await toHashedWebp(file);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      setPhoto(converted);
      onConverted?.(converted.fileName);
    } catch {
      setError("Não foi possível converter a imagem. Use JPG, PNG ou WEBP (HEIC deve ser convertido antes).");
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-[#E5DCEB] p-4 sm:col-span-2">
      <label className="text-xs font-semibold text-[#78909C]">
        Foto do pet (convertida para WEBP)
        <input type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" onChange={(event) => void handleFile(event.target.files?.[0])} />
      </label>
      {error && <p role="alert" className="mt-2 text-xs text-red-600">{error}</p>}
      {photo && (
        <div className="mt-3 flex items-center gap-3">
          <img src={photo.previewUrl} alt="Pré-visualização da foto" className="h-16 w-16 rounded-xl object-cover" />
          <div className="text-xs text-[#546E7A]">
            <p className="font-bold">{photo.fileName}</p>
            <p>{(photo.blob.size / 1024).toFixed(1)} KB</p>
            <a href={photo.previewUrl} download={photo.fileName} className="font-bold text-[#4D246A] hover:underline">Baixar WEBP</a>
          </div>
        </div>
      )}
    </div>
  );
}
