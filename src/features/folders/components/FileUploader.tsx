"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone, FileRejection } from "react-dropzone";
import { useTranslations } from "next-intl";
import { Button } from "@/shared/components/ui/button";
import { Progress } from "@/shared/components/ui/progress";
import {
  Upload,
  X,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { useUploadToFolder } from "../hooks";

interface FileUploaderProps {
  folderId: string;
  onUploadComplete?: () => void;
  maxFiles?: number;
  compact?: boolean;
}

interface FileWithProgress {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "completed" | "error";
  error?: string;
  preview?: string;
}

const MAX_SIZES: Record<string, number> = {
  image: 10 * 1024 * 1024, // 10MB
  pdf: 20 * 1024 * 1024, // 20MB
  video: 100 * 1024 * 1024, // 100MB
};

const ACCEPTED_FILES = {
  "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
  "application/pdf": [".pdf"],
  "video/*": [".mp4", ".mov", ".webm"],
};

function getFileType(file: File): string {
  if (file.type.startsWith("image/")) return "image";
  if (file.type === "application/pdf") return "pdf";
  if (file.type.startsWith("video/")) return "video";
  return "unknown";
}

function getFileIcon(file: File) {
  const type = getFileType(file);
  switch (type) {
    case "image":
      return ImageIcon;
    case "video":
      return Video;
    case "pdf":
      return FileText;
    default:
      return File;
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export function FileUploader({
  folderId,
  onUploadComplete,
  maxFiles = 10,
  compact = false,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileWithProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const t = useTranslations("upload");

  const uploadMutation = useUploadToFolder(folderId);

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      fileRejections.forEach((rejection) => {
        rejection.errors.forEach((error) => {
          toast.error(`${rejection.file.name}: ${error.message}`);
        });
      });

      const validFiles = acceptedFiles.filter((file) => {
        const type = getFileType(file);
        const maxSize = MAX_SIZES[type] || MAX_SIZES.image;
        if (file.size > maxSize) {
          toast.error(
            `${t("fileTooLarge", { name: file.name })} (${t("maxSizeIs", { size: Math.round(maxSize / (1024 * 1024)) })})`
          );
          return false;
        }
        return true;
      });

      const newFiles: FileWithProgress[] = validFiles.map((file) => ({
        file,
        progress: 0,
        status: "pending",
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      setFiles((prev) => [...prev, ...newFiles].slice(0, maxFiles));
    },
    [maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILES,
    maxFiles,
    disabled: isUploading,
  });

  const removeFile = (index: number) => {
    if (isUploading) return;
    const fileToRemove = files[index];
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const fileItem = files[i];
      if (fileItem.status !== "pending") continue;

      setFiles((prev) =>
        prev.map((f, idx) =>
          idx === i ? { ...f, status: "uploading" as const } : f
        )
      );

      try {
        await uploadMutation.mutateAsync({
          file: fileItem.file,
          onProgress: (progress) => {
            setFiles((prev) =>
              prev.map((f, idx) => (idx === i ? { ...f, progress } : f))
            );
          },
        });

        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i ? { ...f, status: "completed" as const, progress: 100 } : f
          )
        );
        successCount++;
      } catch (error) {
        setFiles((prev) =>
          prev.map((f, idx) =>
            idx === i
              ? {
                  ...f,
                  status: "error" as const,
                  error: error instanceof Error ? error.message : "Upload failed",
                }
              : f
          )
        );
        errorCount++;
      }
    }

    setIsUploading(false);

    if (successCount > 0) {
      toast.success(t("uploadComplete", { count: successCount }));
    }
    if (errorCount > 0) {
      toast.error(`${t("uploadFailed")} (${errorCount})`);
    }

    if (successCount > 0) {
      setTimeout(() => {
        setFiles((prev) => prev.filter((f) => f.status !== "completed"));
        onUploadComplete?.();
      }, 1500);
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;

  if (compact) {
    return (
      <div className="space-y-3">
        {/* Compact Dropzone */}
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50",
            isUploading && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="w-6 h-6 mx-auto text-muted-foreground mb-2" />
          {isDragActive ? (
            <p className="text-sm text-primary">{t("dropFilesHere")}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              {t("dragOrClick")}
            </p>
          )}
        </div>

        {/* Compact File Grid */}
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2">
              {files.map((fileItem, index) => {
                const Icon = getFileIcon(fileItem.file);
                const isImage = fileItem.file.type.startsWith("image/");

                return (
                  <div
                    key={index}
                    className={cn(
                      "relative aspect-square rounded-lg border overflow-hidden group",
                      fileItem.status === "completed" && "ring-2 ring-green-500",
                      fileItem.status === "error" && "ring-2 ring-destructive"
                    )}
                  >
                    {/* Preview */}
                    {isImage && fileItem.preview ? (
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-muted">
                        <Icon className="w-8 h-8 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground mt-1 px-1 truncate w-full text-center">
                          {fileItem.file.name.split(".").pop()?.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* Status Overlay */}
                    {fileItem.status === "uploading" && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center">
                          <Loader2 className="w-5 h-5 animate-spin text-white mx-auto" />
                          <span className="text-xs text-white">{fileItem.progress}%</span>
                        </div>
                      </div>
                    )}

                    {fileItem.status === "completed" && (
                      <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      </div>
                    )}

                    {/* Remove Button */}
                    {fileItem.status === "pending" && (
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Upload Button */}
            {pendingCount > 0 && (
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                size="sm"
                className="w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    {t("uploading")}
                  </>
                ) : (
                  <>
                    <Upload className="w-3 h-3 mr-1" />
                    {t("uploadFiles", { count: pendingCount })}
                  </>
                )}
              </Button>
            )}
          </div>
        )}

        {/* Info */}
        <p className="text-[10px] text-muted-foreground text-center">
          {t("compactSizeInfo")}
        </p>
      </div>
    );
  }

  // Original full-size layout
  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          isUploading && "cursor-not-allowed opacity-50"
        )}
      >
        <input {...getInputProps()} />
        <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-primary">{t("dropFilesHere")}</p>
        ) : (
          <>
            <p className="text-foreground mb-2">
              {t("dragOrClick")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("supportedFormats", { count: maxFiles })}
            </p>
          </>
        )}
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((fileItem, index) => {
            const Icon = getFileIcon(fileItem.file);
            return (
              <div
                key={index}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg border",
                  fileItem.status === "completed" && "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-900",
                  fileItem.status === "error" && "bg-destructive/10 border-destructive/30"
                )}
              >
                <Icon className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {fileItem.file.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatSize(fileItem.file.size)}
                    </span>
                    {fileItem.status === "uploading" && (
                      <span className="text-xs text-primary">
                        {fileItem.progress}%
                      </span>
                    )}
                    {fileItem.status === "error" && (
                      <span className="text-xs text-destructive">
                        {fileItem.error}
                      </span>
                    )}
                  </div>
                  {fileItem.status === "uploading" && (
                    <Progress value={fileItem.progress} className="h-1 mt-1" />
                  )}
                </div>
                {fileItem.status === "completed" ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : fileItem.status === "uploading" ? (
                  <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 flex-shrink-0"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            );
          })}

          {pendingCount > 0 && (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("uploading")}
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  {t("uploadFiles", { count: pendingCount })}
                </>
              )}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
