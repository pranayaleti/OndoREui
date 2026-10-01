import { describe, expect, it } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "./form"

function EmailForm() {
  const form = useForm<{ email: string }>({ defaultValues: { email: "" } })
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(() => {})} noValidate>
        <FormField
          control={form.control}
          name="email"
          rules={{ required: "Email is required" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <input type="email" {...field} />
              </FormControl>
              <FormDescription>We reply within a day.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <button type="submit">Send</button>
      </form>
    </Form>
  )
}

describe("Form wiring", () => {
  it("links the label and description to the control before any error", () => {
    render(<EmailForm />)
    const input = screen.getByLabelText("Email")
    const description = screen.getByText("We reply within a day.")
    expect(input).toHaveAttribute("aria-invalid", "false")
    expect(input.getAttribute("aria-describedby")).toBe(description.id)
    expect(screen.queryByText("Email is required")).not.toBeInTheDocument()
  })

  it("marks the control invalid and points it at the message once validation fails", async () => {
    render(<EmailForm />)
    fireEvent.click(screen.getByRole("button", { name: "Send" }))
    const message = await screen.findByText("Email is required")
    await waitFor(() => expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true"))
    const input = screen.getByLabelText("Email")
    const describedBy = (input.getAttribute("aria-describedby") ?? "").split(" ")
    expect(describedBy).toContain(message.id)
    expect(describedBy).toContain(screen.getByText("We reply within a day.").id)
  })
})
