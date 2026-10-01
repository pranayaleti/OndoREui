import { describe, it, expect } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { renderToString } from "react-dom/server"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"

function Sample() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="a">
        <AccordionTrigger>Question A</AccordionTrigger>
        <AccordionContent>Answer A text</AccordionContent>
      </AccordionItem>
      <AccordionItem value="b">
        <AccordionTrigger>Question B</AccordionTrigger>
        <AccordionContent>Answer B text</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

describe("Accordion content stays in the HTML when collapsed", () => {
  it("server-renders every answer, so crawlers and no-JS readers see them", () => {
    const html = renderToString(<Sample />)
    expect(html).toContain("Answer A text")
    expect(html).toContain("Answer B text")
  })

  it("hides closed panels with CSS and shows the open one", () => {
    const { container } = render(<Sample />)
    const panels = container.querySelectorAll('[role="region"]')
    expect(panels).toHaveLength(2)
    for (const panel of panels) {
      expect(panel).toHaveAttribute("data-state", "closed")
      expect(panel.className).toContain("data-[state=closed]:hidden")
    }
    fireEvent.click(screen.getByRole("button", { name: "Question A" }))
    const open = container.querySelector('[role="region"][data-state="open"]')
    expect(open).not.toBeNull()
    expect(open).toHaveTextContent("Answer A text")
    expect(container.querySelectorAll('[role="region"][data-state="closed"]')).toHaveLength(1)
  })
})
