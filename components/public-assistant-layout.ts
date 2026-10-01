/**
 * Placement classes shared by the public assistant launcher (PublicAssistantWidget) and its lazily
 * loaded chat panel (PublicAssistantPanel). Kept in a tiny module so the launcher does not have to
 * import the panel chunk just to agree with it on where things sit.
 */

/**
 * While the mobile navigation drawer is open (the Header renders #mobile-menu only then) the
 * launcher and panel step aside instead of floating above the menu. md:hidden on the drawer
 * means this only applies below the md breakpoint.
 */
export const HIDE_WHILE_NAV_OPEN = 'max-md:[body:has(#mobile-menu)_&]:hidden';

/** Sit above the mobile sticky CTA bar only on routes where that bar renders. */
export function assistantPlacement(stickyBarVisible: boolean): {
  bottomClass: string;
  panelMaxHeightClass: string;
} {
  return {
    bottomClass: stickyBarVisible
      ? 'bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6'
      : 'bottom-6',
    // Cap the panel to the visible viewport (dvh follows the browser bars) so the header and its
    // close button never end up above the top edge on short or landscape screens.
    panelMaxHeightClass: stickyBarVisible
      ? 'max-h-[calc(100dvh-6.5rem-env(safe-area-inset-bottom,0px))] md:max-h-[calc(100dvh-3.5rem)]'
      : 'max-h-[calc(100dvh-3.5rem)]',
  };
}
