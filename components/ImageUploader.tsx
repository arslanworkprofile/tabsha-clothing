"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import axios from "axios";
import type { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

export default function ImageUploader({
  images,
  onChange,
}: {
  images: ProductImage[];
  onChange: (images: ProductImage[]) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const list = Array.from(files);
      if (list.length === 0) return;

      setError(null);
      setUploading(true);
      setProgress(0);

      const formData = new FormData();
      list.forEach((file) => formData.append("images", file));

      try {
        const res = await axios.post("/api/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (evt) => {
            if (evt.total) setProgress(Math.round((evt.loaded / evt.total) * 100));
          },
        });
        onChange([...images, ...res.data.images]);
        if (res.data.warning) setWarning(res.data.warning);
      } catch (err: any) {
        setError(err.response?.data?.error ?? "Upload failed. Try a smaller image or a different format.");
      } finally {
        setUploading(false);
        setProgress(0);
      }
    },
    [images, onChange]
  );

  const handleDelete = async (img: ProductImage) => {
    onChange(images.filter((i) => i.url !== img.url));
    // Best-effort cleanup of the file on disk; ignore failures (e.g. already removed).
    try {
      await axios.delete("/api/upload", { data: { url: img.url } });
    } catch {
      /* noop */
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          uploadFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed p-8 cursor-pointer transition-colors",
          dragging ? "border-ash bg-cloud" : "border-ash/20 hover:border-ash/40"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          hidden
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <>
            <Loader2 className="animate-spin" size={22} />
            <p className="text-sm text-ash/60">Uploading & compressing… {progress}%</p>
          </>
        ) : (
          <>
            <UploadCloud size={22} />
            <p className="text-sm text-ash/60">Drag & drop images here, or click to browse</p>
            <p className="text-xs text-ash/40">JPG, PNG, WebP, AVIF · up to 8MB each · auto-converted to WebP</p>
          </>
        )}
      </div>

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      {warning && (
        <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 mt-2">{warning}</p>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((img) => (
            <div key={img.url} className="relative aspect-square rounded-xl overflow-hidden bg-cloud group">
              <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" sizes="150px" />
              <button
                type="button"
                onClick={() => handleDelete(img)}
                className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Remove image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
