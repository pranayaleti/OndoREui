import { useRef, useState, type KeyboardEvent } from "react"

/**
 * Keyboard behavior for a group of `role="radio"` buttons: one tab stop (the selected option,
 * or the first), and the arrow keys, Home and End move between options.
 *
 * With `onSelect` the arrow keys also select the option they land on, as native radios do.
 * Leave it out when selecting has a side effect, such as advancing a quiz: the arrows then
 * only move focus, and Space or Enter picks the option.
 */
export function useRadioGroup<T>(values: readonly T[], selected: T | undefined, onSelect?: (value: T) => void) {
  const elements = useRef(new Map<T, HTMLButtonElement>())
  const [focused, setFocused] = useState<T>()

  const first = values[0]
  const active =
    focused !== undefined && values.includes(focused) ? focused : selected !== undefined && values.includes(selected) ? selected : first

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    const current = values.findIndex((value) => elements.current.get(value) === document.activeElement)
    if (current === -1) return
    let next: number
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (current + 1) % values.length
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (current + values.length - 1) % values.length
    else if (event.key === "Home") next = 0
    else if (event.key === "End") next = values.length - 1
    else return
    event.preventDefault()
    const value = values[next] as T
    setFocused(value)
    elements.current.get(value)?.focus()
    onSelect?.(value)
  }

  function itemProps(value: T) {
    return {
      ref: (element: HTMLButtonElement | null) => {
        if (element) elements.current.set(value, element)
        else elements.current.delete(value)
      },
      tabIndex: value === active ? 0 : -1,
      onFocus: () => setFocused(value),
    }
  }

  return { groupProps: { onKeyDown }, itemProps }
}
