import React, { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
interface DocumentUploadProps {
  title: string;
  preview?: string; 
  onChange?: (file: File) => void;
  required?: boolean;
  type?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  title,
  preview,
  onChange,
  required = false,
  type = "image/*",
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(preview ?? null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files?.[0];
    if (!uploaded) return;

    setFile(uploaded);
    const previewUrl = URL.createObjectURL(uploaded);

    setLocalPreview(previewUrl);
    onChange?.(uploaded);
  };

  const removeFile = () => {
    setFile(null);
    setLocalPreview(null);
  };

  return (
    <div className="w-full space-y-2">
      <p className="text-sm font-medium dark:text-white">{title}</p>

      {!localPreview ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition hover:bg-gray-50">
          <span className="text-sm text-gray-500">Upload {title} document</span>

          <input
            type="file"
            className="hidden"
            accept={type}
            required={required}
            onChange={handleFile}
          />
        </label>
      ) : (
        <div className="relative w-full rounded-xl border bg-white p-3 shadow-sm">
          <Image
            src={localPreview}
            alt="preview"
            width={500}
            height={200}
            className="h-40 w-full rounded-lg object-contain"
          />

          <div className="mt-2 flex items-center justify-between">
            <p className="truncate text-xs">{file?.name || `${title} document`}</p>

            <div className="flex items-center gap-2">
              <X onClick={removeFile} className="h-5 w-5 cursor-pointer text-red-500" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;