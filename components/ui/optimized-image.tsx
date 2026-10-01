'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  /** Classes applied to the <img> itself (e.g. object-cover); className styles the wrapper. */
  imgClassName?: string
  priority?: boolean
  sizes?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  imgClassName,
  priority = false,
  sizes,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  if (hasError) {
    return (
      <div 
        className={cn(
          "relative flex items-center justify-center bg-muted text-muted-foreground",
          className
        )}
        style={fill ? undefined : { width, height }}
      >
        <span className="text-sm">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className={cn("relative", className)}>
      {isLoading && (
        <div 
          className="absolute inset-0 bg-muted animate-pulse rounded"
          style={fill ? undefined : { width, height }}
        />
      )}
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={cn(
          "transition-opacity duration-300",
          imgClassName,
          isLoading ? "opacity-0" : "opacity-100"
        )}
        priority={priority}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  )
}

// Property image component with specific optimizations
export function PropertyImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  ...props
}: Omit<OptimizedImageProps, 'sizes'>) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={className}
      imgClassName={cn("object-cover", imgClassName)}
      priority={priority}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      {...props}
    />
  )
}
