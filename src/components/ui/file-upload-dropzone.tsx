"use client";

import React, { useCallback, useRef, useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useS3Upload } from "~/hooks/use-s3-upload";
import { cn } from "~/lib/utils";
import { Button } from "./button";
import { Progress } from "./progress";

interface FileUploadDropzoneProps {
  onUploadSuccess: (url: string) => void;
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  className?: string;
  currentImageUrl?: string;
  onRemove?: () => void;
}

export function FileUploadDropzone({
  onUploadSuccess,
  folder = "uploads",
  accept = "image/*",
  maxSizeMB = 5,
  className,
  currentImageUrl,
  onRemove,
}: FileUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { uploadFile, isUploading, progress } = useS3Upload({
    onSuccess: (url) => {
      onUploadSuccess(url);
      setError(null);
    },
    onError: (err) => {
      setError(err.message || "Failed to upload file");
    },
  });

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const validateAndUpload = (file: File) => {
    setError(null);
    if (!file.type.match(accept.replace("*", ".*"))) {
      setError(`Invalid file type. Accepted: ${accept}`);
      return;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB`);
      return;
    }
    uploadFile(file, folder);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        validateAndUpload(e.dataTransfer.files[0]);
      }
    },
    [validateAndUpload]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  if (currentImageUrl && !isUploading) {
    return (
      <div className={cn("relative group rounded-md border border-slate-200 overflow-hidden bg-slate-50 flex items-center justify-center", className)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={currentImageUrl} alt="Uploaded" className="max-h-full max-w-full object-contain p-2" />
        {onRemove && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Button variant="destructive" size="sm" onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}>
              <X className="h-4 w-4 mr-1" /> Remove
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full rounded-md border-2 border-dashed transition-colors",
          dragActive ? "border-blue-500 bg-blue-50/50" : "border-slate-300 bg-slate-50 hover:bg-slate-100",
          isUploading ? "opacity-70 pointer-events-none" : "cursor-pointer",
          className
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange}
          disabled={isUploading}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center p-6 space-y-3 w-full">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <div className="w-full max-w-xs space-y-1">
              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 w-full" />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-6 text-center space-y-2">
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <UploadCloud className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">
              <span className="text-blue-600">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-slate-500">
              SVG, PNG, JPG or GIF (max. {maxSizeMB}MB)
            </p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-2 font-medium">{error}</p>}
    </div>
  );
}
