"use client"

import type React from "react"

import { PixelButton } from "@/components/pixel-button"
import { PixelInput } from "@/components/pixel-input"
import { useState } from "react"

interface ContactWindowProps {
  data?: {
    email?: string
    phone?: string
    social?: {
      github?: string
      linkedin?: string
      twitter?: string
    }
  }
}

export function ContactWindow({ data }: ContactWindowProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Contact form submitted:", formData)
    alert("MESSAGE SENT!")
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2 text-[10px]">
        {data?.email && (
          <div>
            <span className="text-muted-foreground">EMAIL:</span> {data.email}
          </div>
        )}
        {data?.phone && (
          <div>
            <span className="text-muted-foreground">PHONE:</span> {data.phone}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[8px] block mb-1">NAME</label>
          <PixelInput
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="YOUR NAME"
            required
          />
        </div>
        <div>
          <label className="text-[8px] block mb-1">EMAIL</label>
          <PixelInput
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="YOUR@EMAIL.COM"
            required
          />
        </div>
        <div>
          <label className="text-[8px] block mb-1">MESSAGE</label>
          <textarea
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="YOUR MESSAGE..."
            className="w-full px-3 py-2 border-2 border-border bg-input text-[10px] min-h-[100px] resize-none"
            required
          />
        </div>
        <PixelButton type="submit" variant="primary" className="text-[10px] w-full">
          SEND MESSAGE
        </PixelButton>
      </form>

      {data?.social && (
        <div className="pt-4 border-t-2 border-border">
          <p className="text-[8px] mb-2">FIND ME ON:</p>
          <div className="flex gap-2">
            {data.social.github && (
              <PixelButton variant="secondary" className="text-[8px] px-2 py-1" asChild>
                <a href={data.social.github} target="_blank" rel="noopener noreferrer">
                  GITHUB
                </a>
              </PixelButton>
            )}
            {data.social.linkedin && (
              <PixelButton variant="secondary" className="text-[8px] px-2 py-1" asChild>
                <a href={data.social.linkedin} target="_blank" rel="noopener noreferrer">
                  LINKEDIN
                </a>
              </PixelButton>
            )}
            {data.social.twitter && (
              <PixelButton variant="secondary" className="text-[8px] px-2 py-1" asChild>
                <a href={data.social.twitter} target="_blank" rel="noopener noreferrer">
                  TWITTER
                </a>
              </PixelButton>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
