"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, File, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "uploading" | "success" | "error"
  progress: number
  error?: string
}

interface FileUploadProps {
  onFilesChange: (files: UploadedFile[]) => void
}

export function FileUpload({ onFilesChange }: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        status: "uploading" as const,
        progress: 0,
      }))

      setUploadedFiles((prev) => [...prev, ...newFiles])

      // Simulate file upload
      newFiles.forEach((file) => {
        simulateUpload(file.id)
      })

      onFilesChange([...uploadedFiles, ...newFiles])
    },
    [uploadedFiles, onFilesChange],
  )

  const simulateUpload = (fileId: string) => {
    const interval = setInterval(() => {
      setUploadedFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId) {
            const newProgress = Math.min(file.progress + Math.random() * 30, 100)
            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...file,
                progress: 100,
                status: Math.random() > 0.1 ? "success" : "error",
                error: Math.random() > 0.1 ? undefined : "Upload failed. Please try again.",
              }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 200)
  }

  const removeFile = (fileId: string) => {
    const updatedFiles = uploadedFiles.filter((file) => file.id !== fileId)
    setUploadedFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
      "application/json": [".json"],
    },
    multiple: true,
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
          ${
            isDragActive
              ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
              : "border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
          }
        `}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <p className="text-lg font-medium text-black dark:text-white mb-2">
          {isDragActive ? "Drop files here..." : "Drag & drop files here or click to browse"}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Accepted formats: PDF, DOCX, TXT, JSON (Max 10MB per file)
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-black dark:text-white">Uploaded Files</h4>
          {uploadedFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <File className="h-5 w-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-black dark:text-white truncate">{file.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{formatFileSize(file.size)}</p>
                  {file.status === "uploading" && <Progress value={file.progress} className="w-full mt-2 h-1" />}
                  {file.status === "error" && file.error && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1">{file.error}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {file.status === "uploading" && <Loader2 className="h-4 w-4 animate-spin text-blue-600" />}
                {file.status === "success" && <CheckCircle className="h-4 w-4 text-green-600" />}
                {file.status === "error" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
