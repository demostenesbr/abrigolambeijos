import { useEffect, useRef, useState } from "react";

const MAX_FILE_BYTES = 15 * 1024 * 1024;

interface ConvertedPhoto {
  fileName: string;
  blob: Blob;
  previewUrl: string;
}

interface PetPhotoConverterProps {
  onConverted?: (fileName: string) => void;
}

type WorkerResult = { ok: true; fileName: string; blob: Blob } | { ok: false; message: string };

// O worker só é criado quando há um arquivo: sem upload, nenhum custo extra.
function convertInWorker(file: File, workerRef: { current: Worker | null }): Promise<ConvertedPhoto> {
  return new Promise((resolve, reject) => {
    workerRef.current?.terminate();
    const worker = new Worker(new URL("../../workers/petPhoto.worker.ts", import.meta.url), { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerResult>) => {
      worker.terminate();
      if (workerRef.current === worker) workerRef.current = null;
      const result = event.data;
      if (result.ok) resolve({ fileName: result.fileName, blob: result.blob, previewUrl: URL.createObjectURL(result.blob) });
      else reject(new Error(result.message));
    };
    worker.onerror = () => {
      worker.terminate();
      reject(new Error("Falha no worker"));
    };
    worker.postMessage({ file });
  });
}

export default function PetPhotoConverter({ onConverted }: PetPhotoConverterProps) {
  const [photo, setPhoto] = useState<ConvertedPhoto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(
    () => () => {
      if (photo) URL.revokeObjectURL(photo.previewUrl);
    },
    [photo],
  );

  useEffect(() => () => workerRef.current?.terminate(), []);

  const handleFile = async (file?: File) => {
    if (!file) return;
    setError(null);
    if (file.size > MAX_FILE_BYTES) {
      setError("A imagem excede 15 MB. Escolha um arquivo menor.");
      return;
    }
    setConverting(true);
    try {
      const converted = await convertInWorker(file, workerRef);
      setPhoto(converted);
      onConverted?.(converted.fileName);
    } catch {
      setError("Não foi possível converter a imagem. Use JPG, PNG ou WEBP (HEIC deve ser convertido antes).");
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="rounded-xl border border-dashed border-[#E5DCEB] p-4 sm:col-span-2">
      <label className="text-xs font-semibold text-[#78909C]">
        Foto do pet (convertida para WEBP)
        <input type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 block w-full text-sm" onChange={(event) => void handleFile(event.target.files?.[0])} />
      </label>
      {converting && <p className="mt-2 text-xs text-[#78909C]">Convertendo imagem...</p>}
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
