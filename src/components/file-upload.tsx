"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload, Music, FileText } from "lucide-react"
import { WorkspaceFrameLayers } from "./workspace/workspace-frame"
import { WorkspaceAction as PixelButton } from "./workspace/workspace-primitives"
import Image from "next/image"

interface FileUploadProps {
  accept?: string
  onFileSelect: (file: File) => void
  preview?: string
  label?: string
  maxSize?: number // in MB
  className?: string
  /** When set, a remove button appears inside the box while a file or image is shown. */
  onRemove?: () => void | Promise<void>
  removeLabel?: string
}

export function FileUpload({ accept, onFileSelect, preview, label, maxSize = 5, className, onRemove, removeLabel = "REMOVE" }: FileUploadProps) {
  const [removing, setRemoving] = useState(false)
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
    <div className={`space-y-3 ${className || ""}`}>
      {label && <p className="font-dialogue text-sm">{label}</p>}

      <label
        data-invalid={error ? true : undefined}
        data-drag-active={dragActive || undefined}
        className={`persona-upload ws-cut-frame relative block border border-dashed p-6 text-center space-y-3 cursor-pointer transition-colors ${dragActive
          ? "border-primary bg-primary/10"
          : error
            ? "border-destructive bg-destructive/10"
            : "border-border hover:bg-muted"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <WorkspaceFrameLayers />
        <input ref={inputRef} type="file" aria-label={label || "Choose file to upload"} className="sr-only" accept={accept} onChange={handleChange} />

        {preview ? (
          <div className="space-y-3">
            {accept?.includes("image") ? (
              <Image
                src={preview}
                alt="Preview"
                className="mx-auto border-2 border-border"
                width={200}
                height={100}
              />
            ) : accept?.includes("audio") ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center"><Music className="size-6" aria-hidden="true" /></div>
                <span className="font-dialogue text-sm">AUDIO FILE LOADED</span>
              </div>
            ) : (
              <FileText className="size-8 mx-auto" aria-hidden="true" />
            )}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <PixelButton
                type="button"
                variant="secondary"
                className="text-xs"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleClick()
                }}
              >
                CHANGE FILE
              </PixelButton>
              {onRemove && (
                <PixelButton
                  type="button"
                  variant="secondary"
                  className="text-xs text-[#bc174c]"
                  disabled={removing}
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setRemoving(true)
                    try {
                      await onRemove()
                    } finally {
                      setRemoving(false)
                    }
                  }}
                >
                  {removing ? "REMOVING…" : removeLabel}
                </PixelButton>
              )}
            </div>
          </div>
        ) : (
          <>
            <Upload className="w-8 h-8 mx-auto" />
            <p className="font-dialogue text-sm text-muted-foreground">{error || "DRAG & DROP OR CLICK TO UPLOAD"}</p>
            {!error && <p className="font-dialogue text-sm text-muted-foreground">MAX SIZE: {maxSize}MB</p>}
          </>
        )}
      </label>
    </div>
  )
}
