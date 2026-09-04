import { useCallback, useRef, useState } from "react";
import type { Lang } from "../i18n";
import { translations } from "../i18n";

interface UploadPanelProps {
  lang: Lang;
  previewUrl: string | null;
  onFileSelected: (file: File) => void;
  error: string | null;
}

export default function UploadPanel({
  lang,
  previewUrl,
  onFileSelected,
  error
}: UploadPanelProps) {
  const t = translations[lang];
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      onFileSelected(files[0]);
    },
    [onFileSelected]
  );

  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-wide text-charcoal/60 font-sans">
        {t.uploadLabel}
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`w-full rounded-slip border-2 border-dashed p-8 text-left transition-colors ${
          isDragging ? "border-ink bg-ink/5" : "border-line bg-paper"
        }`}
      >
        {previewUrl ? (
          <div className="flex items-center gap-4">
            <img
              src={previewUrl}
              alt=""
              className="h-20 w-20 rounded-slip object-cover border border-line"
            />
            <span className="font-sans text-sm text-charcoal/80">
              {t.changePhoto}
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-6 text-center">
            <span className="font-display text-lg">{t.uploadHint}</span>
            <span className="font-sans text-xs text-charcoal/50 sm:hidden">
              {t.uploadHintMobile}
            </span>
          </div>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && (
        <p className="mt-3 font-sans text-sm text-rotten" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
