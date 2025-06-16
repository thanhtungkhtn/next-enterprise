<parameter name="content">"use client"

import { useState, useEffect } from "react"
import { Button } from "components/Button/Button"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm rounded-lg bg-white p-4 shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            Install App
          </h3>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
            Install this app on your device for a better experience
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          aria-label="Dismiss"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          onClick={handleInstallClick}
          size="sm"
          className="flex-1"
          href="#"
        >
          Install
        </Button>
        <Button
          onClick={handleDismiss}
          intent="secondary"
          size="sm"
          className="flex-1"
          href="#"
        >
          Not now
        </Button>
      </div>
    </div>
  )
}</parameter>