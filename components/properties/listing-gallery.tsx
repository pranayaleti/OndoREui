"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { ApiPhoto } from "@/app/types/property"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"

export type ListingGalleryPhoto = Pick<ApiPhoto, "id" | "url" | "caption" | "orderIndex">

type ListingGalleryProps = {
  title: string
  photos: ListingGalleryPhoto[]
}

function photoAlt(title: string, photo: ListingGalleryPhoto, index: number, total: number): string {
  return photo.caption?.trim() || `${title} — photo ${index + 1} of ${total}`
}

function sortedPhotos(photos: ListingGalleryPhoto[]): ListingGalleryPhoto[] {
  return [...photos].filter((p) => p.url).sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0))
}

export function ListingGallery({ title, photos }: ListingGalleryProps) {
  const ordered = sortedPhotos(photos)
  const total = ordered.length
  const headingId = useId()
  const [open, setOpen] = useState(false)
  const [index, setOpenIndex] = useState(0)
  const [mobileIndex, setMobileIndex] = useState(0)

  const go = useCallback(
    (next: number) => {
      if (total === 0) return
      setOpenIndex((next + total) % total)
    },
    [total],
  )

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault()
        go(index + 1)
      } else if (event.key === "ArrowLeft") {
        event.preventDefault()
        go(index - 1)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, index, go])

  if (total === 0) return null

  const openAt = (i: number) => {
    setOpenIndex(i)
    setOpen(true)
  }

  const current = ordered[index]
  const thumbs = ordered.slice(1, 5)
  const extra = Math.max(0, total - 5)

  return (
    <section aria-labelledby={headingId} className="mb-8">
      <h2 id={headingId} className="sr-only">
        Listing photos
      </h2>

      <div className="relative md:hidden">
        <ul
          className="flex snap-x snap-mandatory gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onScroll={(event) => {
            const el = event.currentTarget
            const width = el.clientWidth || 1
            setMobileIndex(Math.min(total - 1, Math.round(el.scrollLeft / width)))
          }}
        >
          {ordered.map((photo, i) => (
            <li key={photo.id} className="min-w-full snap-center">
              <button
                type="button"
                className="block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => openAt(i)}
                aria-label={`Open photo ${i + 1} of ${total}: ${photoAlt(title, photo, i, total)}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.url}
                  alt={photoAlt(title, photo, i, total)}
                  className="h-72 w-full rounded-lg object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={i === 0 ? "high" : "low"}
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="pointer-events-none absolute bottom-3 right-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm">
          {mobileIndex + 1} / {total}
        </p>
      </div>

      <div className="hidden gap-2 md:grid md:grid-cols-2">
        <button
          type="button"
          className="relative overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={() => openAt(0)}
          aria-label={`Open photo 1 of ${total}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={ordered[0].url}
            alt={photoAlt(title, ordered[0], 0, total)}
            className="h-96 w-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
          <span className="absolute bottom-3 right-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow-sm">
            1 / {total}
          </span>
        </button>
        {thumbs.length > 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {thumbs.map((photo, i) => {
              const photoIndex = i + 1
              const isLast = i === thumbs.length - 1 && extra > 0
              return (
                <button
                  key={photo.id}
                  type="button"
                  className="relative overflow-hidden rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  onClick={() => openAt(photoIndex)}
                  aria-label={
                    isLast
                      ? `View all ${total} photos`
                      : `Open photo ${photoIndex + 1} of ${total}`
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt={photoAlt(title, photo, photoIndex, total)}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                  {isLast ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-foreground/50 text-sm font-semibold text-background">
                      +{extra} more
                    </span>
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : null}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {open ? (
        <DialogContent
          className="max-h-[95vh] max-w-5xl border-border bg-background p-3 sm:p-4"
          closeLabel="Close photos"
        >
          <DialogTitle className="sr-only">{title} photos</DialogTitle>
          <DialogDescription className="sr-only">
            Photo {index + 1} of {total}. Use arrow keys to move between photos.
          </DialogDescription>
          {current ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.url}
                alt={photoAlt(title, current, index, total)}
                className="max-h-[75vh] w-full rounded-md object-contain"
                onPointerDown={(event) => {
                  const startX = event.clientX
                  const handleUp = (up: PointerEvent) => {
                    const delta = up.clientX - startX
                    if (delta > 50) go(index - 1)
                    if (delta < -50) go(index + 1)
                    window.removeEventListener("pointerup", handleUp)
                  }
                  window.addEventListener("pointerup", handleUp)
                }}
              />
              <p className="mt-2 text-center text-sm text-muted-foreground">
                {index + 1} / {total}
              </p>
              {total > 1 ? (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 min-h-11 min-w-11 -translate-y-1/2"
                    onClick={() => go(index - 1)}
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 min-h-11 min-w-11 -translate-y-1/2"
                    onClick={() => go(index + 1)}
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                </>
              ) : null}
            </div>
          ) : null}
        </DialogContent>
        ) : null}
      </Dialog>
    </section>
  )
}

export function ListingGalleryEmptyNotice() {
  return (
    <p className="mb-8 rounded-lg border border-dashed border-border bg-muted/40 px-4 py-8 text-center text-sm text-muted-foreground">
      Photos have not been added for this listing yet.
    </p>
  )
}
