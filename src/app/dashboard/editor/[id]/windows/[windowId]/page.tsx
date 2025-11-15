"use client"

import { useParams, useRouter } from "next/navigation"
import { PixelCard } from "@/components/pixel-card"
import { PixelInput } from "@/components/pixel-input"
import { PixelButton } from "@/components/pixel-button"
import { useEffect, useMemo, useState } from "react"

import { WINDOW_TEMPLATES_META } from "@/components/window-templates"
import { SoundProvider } from "@/components/portfolio/sound-context"

const templateToContentType: Record<string, 'text'|'markdown'|'html'|'projects'|'links'> = {
  'about-me': 'html',
  projects: 'projects',
  contact: 'text',
  resume: 'html',
  blog: 'markdown',
  links: 'links',
  custom: 'html',
}

export default function EditWindowPage() {
  const params = useParams<{ id: string; windowId: string }>()
  const router = useRouter()
  const portfolioId = params?.id
  const windowId = params?.windowId

  const [name, setName] = useState("")
  const [template, setTemplate] = useState<string>("")
  const [contentType, setContentType] = useState<'text'|'markdown'|'html'|'projects'|'links'>("text")
  const [content, setContent] = useState("")

  const selectedTemplate = useMemo(
    () => WINDOW_TEMPLATES_META.find(t => t.id === template),
    [template]
  )

  useEffect(() => {
    const load = async () => {
      if (!portfolioId || !windowId) return
      const res = await fetch(`/api/windows/get?portfolioId=${portfolioId}&windowId=${windowId}`)
      if (!res.ok) return
      const row = await res.json()
      setName(row.name || '')
      const c = row.content || { type: 'text', data: '' }
      setContentType(c.type)
      setContent(typeof c.data === 'string' ? c.data : JSON.stringify(c.data))
    }
    void load()
  }, [portfolioId, windowId])

  // Placeholder handlers; wire to your save API when ready
  const handleSave = async () => {
    if (!portfolioId || !windowId) return
    const res = await fetch('/api/windows/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        portfolioId: Number(portfolioId),
        windowId: String(windowId),
        name,
        content: { type: contentType, data: content },
      }),
    })
    if (res.ok) router.back()
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <PixelCard>
        <div className="space-y-4">
          <h2 className="text-sm pixel-text-shadow">EDIT WINDOW</h2>
          <div className="text-[10px] text-muted-foreground">
            Portfolio: <span className="font-bold">{portfolioId}</span> • Window: <span className="font-bold">{windowId}</span>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px]">WINDOW NAME</label>
            <PixelInput value={name} onChange={(e) => setName(e.target.value)} placeholder="ABOUT ME" />
          </div>

          <div className="space-y-2">
            <label className="block text-[10px]">TEMPLATE</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {WINDOW_TEMPLATES_META.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    const ct = templateToContentType[t.id] || 'html'
                    setTemplate(t.id)
                    setContentType(ct)
                    // Initial content placeholder by template id
                    const DEFAULTS: Record<string,string> = {
                      'about-me': '<h3>About Me</h3><p>Tell your story...</p>',
                      'projects': JSON.stringify([{ title: 'Project', description: 'Description', link: '' }], null, 2),
                      'contact': 'Email: you@example.com',
                      'resume': '<h3>Experience</h3>',
                      'blog': '# My Blog',
                      'links': JSON.stringify([{ label: 'GitHub', url: 'https://github.com' }], null, 2),
                    }
                    setContent(DEFAULTS[t.id] ?? '')
                    if (!name) setName(t.name)
                  }}
                  className={`text-[10px] px-2 py-2 border-2 border-border ${template===t.id? 'bg-primary text-primary-foreground':'bg-card hover:bg-muted'}`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <div className="space-y-2">
              <label className="block text-[10px]">TEMPLATE PREVIEW</label>
              <div className="border-2 border-border bg-card p-2 max-h-[480px] overflow-auto">
                <SoundProvider>
                  <selectedTemplate.component />
                </SoundProvider>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <PixelButton variant="secondary" className="text-[10px] flex-1" onClick={() => router.back()}>CANCEL</PixelButton>
            <PixelButton variant="primary" className="text-[10px] flex-1" onClick={handleSave}>SAVE</PixelButton>
          </div>
        </div>
      </PixelCard>
    </div>
  )
}
