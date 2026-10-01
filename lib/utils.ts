import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

// Named z-index layers from tailwind.config.ts (theme.extend.zIndex). Registered here so a call-site
// class such as `z-50` or `z-modal` replaces the component default instead of sitting beside it.
export const OVERLAY_Z_LAYERS = ["overlay", "modal", "popover", "toast"] as const

const twMerge = extendTailwindMerge({
  extend: { classGroups: { z: [{ z: [...OVERLAY_Z_LAYERS] }] } },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
