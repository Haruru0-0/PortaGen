"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"
import { PixelButton } from "./pixel-button"

interface FileUploadProps {
  accept?: string
  onFileSelect: (file: File) => void
  preview?: string
  label?: string
  maxSize?: number // in MB
}

export function FileUpload({ accept, onFileSelect, preview, label, maxSize = 5 }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    setError("")

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      setError(`FILE TOO LARGE (MAX ${maxSize}MB)`)
      return false
    }

    // Check file type if accept is specified
    if (accept) {
      const acceptedTypes = accept.split(",").map((t) => t.trim())
      const fileType = file.type
      const fileExt = `.${file.name.split(".").pop()}`

      const isAccepted = acceptedTypes.some((type) => {
        if (type.startsWith(".")) {
          return fileExt === type
        }
        return fileType.match(new RegExp(type.replace("*", ".*")))
      })

      if (!isAccepted) {
        setError("INVALID FILE TYPE")
        return false
      }
    }

    return true
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (validateFile(file)) {
        onFileSelect(file)
      }
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="space-y-3">
      {label && <p className="text-[10px]">{label}</p>}

      <div
        className={`border-4 border-dashed p-8 text-center space-y-3 cursor-pointer transition-colors ${
          dragActive
            ? "border-primary bg-primary/10"
            : error
              ? "border-destructive bg-destructive/10"
              : "border-border hover:bg-muted"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={handleChange} />

        {preview ? (
          <div className="space-y-3">
            {accept?.includes("image") ? (
              <img
                src={preview || "/placeholder.svg"}
                alt="Preview"
                className="max-h-32 mx-auto border-2 border-border"
              />
            ) : accept?.includes("audio") ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-12 bg-primary flex items-center justify-center text-xl">♪</div>
                <span className="text-[10px]">AUDIO FILE LOADED</span>
              </div>
            ) : (
              <div className="text-2xl">📄</div>
            )}
            <PixelButton
              variant="secondary"
              className="text-[10px]"
              onClick={(e) => {
                e.stopPropagation()
                handleClick()
              }}
            >
              CHANGE FILE
            </PixelButton>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto" />
            <p className="text-[10px] text-muted-foreground">{error || "DRAG & DROP OR CLICK TO UPLOAD"}</p>
            {!error && <p className="text-[8px] text-muted-foreground">MAX SIZE: {maxSize}MB</p>}
          </>
        )}
      </div>
    </div>
  )
}
