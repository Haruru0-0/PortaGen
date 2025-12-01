"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { LockScreen } from "@/components/portfolio/lock-screen"
import { SoundProvider } from "@/components/portfolio/sound-context"
import { ThemeProvider } from "@/components/theme-provider"
import { EditorProvider } from "@/contexts/editorContext"
import { DesktopProvider } from "@/contexts/desktopContext"
import { IconProvider } from "@/contexts/iconContext"
import { WindowsProvider } from "@/contexts/windowsContext"
import { LockScreenProvider } from "@/contexts/lockScreenContext"

const Desktop = dynamic(() => import("@/components/portfolio/desktop"), { ssr: false })

export default function PortfolioPreviewPage() {
  const [isUnlocked, setIsUnlocked] = useState(false)

  return (
    <ThemeProvider defaultTheme="light" storageKey="portfolio-theme">
      <SoundProvider>
        <EditorProvider>
          <DesktopProvider>
            <IconProvider>
              <WindowsProvider>
                <LockScreenProvider>
                  {!isUnlocked ? (
                    <LockScreen
                      onUnlock={() => setIsUnlocked(true)}
                    />
                  ) : (
                    <div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
                      <div className="w-full max-w-6xl h-[80vh] border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
                        <Desktop preview={true} />
                      </div>
                    </div>
                  )}
                </LockScreenProvider>
              </WindowsProvider>
            </IconProvider>
          </DesktopProvider>
        </EditorProvider>
      </SoundProvider>
    </ThemeProvider>
  )
}
<div className="w-full h-screen flex items-center justify-center bg-gray-100 p-4">
  <div className="w-full max-w-6xl h-[80vh] border-4 border-gray-800 rounded-lg overflow-hidden shadow-2xl">
    <Desktop preview={true} />
  </div>
</div>
                )}
              </WindowsProvider >
            </IconProvider >
          </DesktopProvider >
        </EditorProvider >
      </SoundProvider >
    </ThemeProvider >
  )
}
