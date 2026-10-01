"use client"

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
}

/**
 * Lazy-loaded image component with Intersection Observer
 * Only loads images when they're about to enter the viewport
 */
export function LazyImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  quality = 85,
  sizes,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  ...props
}: LazyImageProps) {
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (priority || isInView) return

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    )

    const currentRef = imgRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      observer.disconnect()
    }
  }, [priority, isInView])

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  const defaultBlurDataURL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='

  if (hasError) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-muted text-gray-400",
          fill && "absolute inset-0",
          className
        )}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    // With `fill`, the parent supplies the box: this wrapper covers it and `className` (object-cover,
    // hover scale, rounding) goes on the image. Otherwise the wrapper is a zero-height, relative
    // div and a fill image has nothing to fill.
    <div ref={imgRef} className={fill ? "absolute inset-0" : cn("relative", className)}>
      {isLoading && (
        <div
          className="absolute inset-0 bg-muted animate-pulse rounded"
          style={fill ? undefined : { width, height }}
          aria-hidden="true"
        />
      )}
      {isInView ? (
        <Image
          src={src}
          alt={alt}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          fill={fill}
          className={cn(
            "transition-opacity duration-300",
            isLoading ? "opacity-0" : "opacity-100",
            fill && className
          )}
          priority={priority}
          quality={quality}
          sizes={sizes}
          placeholder={placeholder}
          blurDataURL={blurDataURL || defaultBlurDataURL}
          onLoad={handleLoad}
          onError={handleError}
          loading={priority ? undefined : "lazy"}
          {...props}
        />
      ) : (
        <div
          className="bg-muted animate-pulse"
          style={fill ? { width: '100%', height: '100%' } : { width, height }}
          aria-hidden="true"
        />
      )}
    </div>
  )
}

