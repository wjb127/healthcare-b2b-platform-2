"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Upload,
  File,
  X,
  CheckCircle,
  FileText,
  Image,
  FileSpreadsheet,
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

interface FileUploadAreaProps {
  onFilesChange?: (files: UploadedFile[]) => void;
  maxFiles?: number;
  acceptedFormats?: string[];
}

export default function FileUploadArea({
  onFilesChange,
  maxFiles = 5,
  acceptedFormats = [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".jpg", ".png"],
}: FileUploadAreaProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      processFiles(selectedFiles);
    }
  };

  const processFiles = (files: File[]) => {
    const remainingSlots = maxFiles - uploadedFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newFiles: UploadedFile[] = filesToAdd.map((file) => ({
      id: `file-${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date(),
    }));

    const updatedFiles = [...uploadedFiles, ...newFiles];
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId);
    setUploadedFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image")) return Image;
    if (type.includes("spreadsheet") || type.includes("excel")) return FileSpreadsheet;
    return FileText;
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <Card
        className={`relative border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-teal-600 bg-teal-50/50"
            : "border-slate-200 hover:border-teal-600 bg-white"
        }`}
      >
        <div
          className="p-8 cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center text-center">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                isDragging ? "bg-teal-100" : "bg-slate-100"
              }`}
            >
              <Upload
                className={`h-8 w-8 ${
                  isDragging ? "text-teal-600" : "text-slate-400"
                }`}
              />
            </div>

            <p className="text-lg font-medium text-slate-700 mb-2">
              파일을 드래그하여 업로드
            </p>
            <p className="text-sm text-slate-500 mb-4">
              또는 클릭하여 파일 선택
            </p>

            <Button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              파일 선택
            </Button>

            <p className="text-xs text-slate-400 mt-4">
              지원 형식: {acceptedFormats.join(", ")}
            </p>
            <p className="text-xs text-slate-400">
              최대 {maxFiles}개 파일, 각 파일당 10MB 이하
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={acceptedFormats.join(",")}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </Card>

      {/* Uploaded Files List */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-slate-700">
                업로드된 파일 ({uploadedFiles.length}/{maxFiles})
              </h4>
              {uploadedFiles.length > 0 && (
                <Badge className="bg-teal-300/30 text-teal-700 border-teal-300/50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  업로드 완료
                </Badge>
              )}
            </div>

            {uploadedFiles.map((file) => {
              const FileIcon = getFileIcon(file.type);
              return (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-lg hover:border-teal-300 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-50 rounded-lg flex items-center justify-center">
                      <FileIcon className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {file.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1 hover:bg-slate-100 rounded transition-colors"
                  >
                    <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
                  </button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Message */}
      {uploadedFiles.length === maxFiles && (
        <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <CheckCircle className="h-4 w-4 text-yellow-600" />
          <p className="text-sm text-yellow-700">
            최대 파일 개수에 도달했습니다.
          </p>
        </div>
      )}
    </div>
  );
}