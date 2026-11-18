import { describe, it, expect } from "vitest"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  emailValidation,
  phoneValidation,
  contactFormSchema,
  leadFormSchema,
  maintenanceRequestSchema,
  propertyFormSchema,
  loginSchema,
  registrationSchema,
  searchSchema,
  sweepstakesSchema,
} from "./validations"

describe("validations", () => {
  describe("emailValidation", () => {
    it("accepts valid email", () => {
      expect(emailValidation.safeParse("user@example.com").success).toBe(true)
    })
    it("rejects invalid email", () => {
      expect(emailValidation.safeParse("invalid").success).toBe(false)
      expect(emailValidation.safeParse("").success).toBe(false)
    })
  })

  describe("phoneValidation", () => {
    it("accepts 10-digit US phone", () => {
      expect(phoneValidation.safeParse("5551234567").success).toBe(true)
      expect(phoneValidation.safeParse("555-123-4567").success).toBe(true)
      expect(phoneValidation.safeParse("(555) 123-4567").success).toBe(true)
    })
    it("accepts international with +", () => {
      expect(phoneValidation.safeParse("+15551234567").success).toBe(true)
    })
    it("rejects too few digits", () => {
      expect(phoneValidation.safeParse("123").success).toBe(false)
    })
    it("rejects non-phone characters", () => {
      expect(phoneValidation.safeParse("555-abc-4567").success).toBe(false)
    })
  })

  describe("contactFormSchema", () => {
    it("parses valid contact form", () => {
      const result = contactFormSchema.safeParse({
        name: "John Doe",
        email: "john@example.com",
        phone: "5551234567",
        message: "Hello, this is a test message.",
        subject: "Inquiry",
      })
      expect(result.success).toBe(true)
    })
    it("rejects short name", () => {
      const result = contactFormSchema.safeParse({
        name: "J",
        email: "j@x.com",
        phone: "5551234567",
        message: "Valid message here",
        subject: "Sub",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("leadFormSchema", () => {
    it("parses valid lead form", () => {
      const result = leadFormSchema.safeParse({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "5551234567",
        address: "123 Main St",
        city: "Lehi",
        zipCode: "84043",
        propertyType: "house",
        propertyValue: "350000",
        source: "website",
      })
      expect(result.success).toBe(true)
    })
    it("rejects invalid ZIP", () => {
      const result = leadFormSchema.safeParse({
        firstName: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        phone: "5551234567",
        address: "123 Main St",
        city: "Lehi",
        zipCode: "invalid",
        propertyType: "house",
        propertyValue: "350000",
        source: "website",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("maintenanceRequestSchema", () => {
    it("parses valid maintenance request", () => {
      const result = maintenanceRequestSchema.safeParse({
        title: "Leaking faucet",
        description: "The kitchen faucet is dripping constantly.",
        priority: "medium",
        category: "plumbing",
        entryPermission: "yes",
        petInHome: "no",
      })
      expect(result.success).toBe(true)
    })
  })

  describe("propertyFormSchema", () => {
    it("parses valid property form", () => {
      const result = propertyFormSchema.safeParse({
        name: "Sunset Apartments Unit 1",
        address: "123 Main Street, Apt 1",
        city: "Lehi",
        state: "UT",
        zipCode: "84043",
        propertyType: "apartment",
        bedrooms: 2,
        bathrooms: 2,
        squareFeet: 1200,
        rent: 1500,
        deposit: 1500,
        description: "Spacious two-bedroom with mountain views.",
      })
      expect(result.success).toBe(true)
    })
  })

  describe("loginSchema", () => {
    it("parses valid login", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "Password1",
        role: "owner",
      })
      expect(result.success).toBe(true)
    })
    it("rejects weak password", () => {
      const result = loginSchema.safeParse({
        email: "user@example.com",
        password: "short",
        role: "owner",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("registrationSchema", () => {
    it("rejects when passwords do not match", () => {
      const result = registrationSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "5551234567",
        password: "Password1",
        confirmPassword: "Password2",
        role: "tenant",
        termsAccepted: true,
      })
      expect(result.success).toBe(false)
    })
    it("rejects when terms not accepted", () => {
      const result = registrationSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "5551234567",
        password: "Password1",
        confirmPassword: "Password1",
        role: "tenant",
        termsAccepted: false,
      })
      expect(result.success).toBe(false)
    })
  })

  describe("searchSchema", () => {
    it("parses valid search", () => {
      const result = searchSchema.safeParse({
        query: "3 bedroom",
        location: "Lehi",
        minPrice: 200000,
        maxPrice: 500000,
      })
      expect(result.success).toBe(true)
    })
    it("rejects empty query", () => {
      const result = searchSchema.safeParse({ query: "" })
      expect(result.success).toBe(false)
    })
  })

  describe("sweepstakesSchema", () => {
    it("parses valid sweepstakes entry", () => {
      const result = sweepstakesSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "5551234567",
        services: ["buy"],
      })
      expect(result.success).toBe(true)
    })
    it("rejects empty services array", () => {
      const result = sweepstakesSchema.safeParse({
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "5551234567",
        services: [],
      })
      expect(result.success).toBe(false)
    })
  })

  // Zod 4 replaced `required_error` with `error`. These pin the Zod 3 behaviour the forms
  // rely on: a custom message only when the field is missing, Zod's default otherwise.
  describe("required enum messages", () => {
    const valid = {
      title: "Leaking kitchen tap",
      description: "The tap in the kitchen leaks constantly.",
      priority: "high",
      category: "plumbing",
      entryPermission: "yes",
      petInHome: "no",
    }
    const messagesFor = (input: Record<string, unknown>, field: string) => {
      const result = maintenanceRequestSchema.safeParse(input)
      if (result.success) return []
      return result.error.issues.filter((i) => i.path[0] === field).map((i) => i.message)
    }

    it("uses the custom message when the field is missing", () => {
      const { priority: _priority, ...missing } = valid
      expect(messagesFor(missing, "priority")).toEqual(["Please select a priority level"])
    })
    it("keeps Zod's default message for an invalid value", () => {
      const messages = messagesFor({ ...valid, priority: "urgent" }, "priority")
      expect(messages).toHaveLength(1)
      expect(messages[0]).not.toBe("Please select a priority level")
    })
    it("still accepts every valid value", () => {
      expect(maintenanceRequestSchema.safeParse(valid).success).toBe(true)
    })
    it("applies to the other required enums and to the login role", () => {
      expect(messagesFor({}, "category")).toEqual(["Please select a category"])
      expect(messagesFor({}, "entryPermission")).toEqual(["Please specify entry permission"])
      const login = loginSchema.safeParse({ email: "a@b.co", password: "Passw0rdx" })
      expect(login.success).toBe(false)
      expect(!login.success && login.error.issues.map((i) => i.message)).toContain("Please select a role")
    })
  })

  // Forms use @hookform/resolvers' zodResolver; resolvers 3.x cannot read Zod 4 errors.
  describe("zodResolver with Zod 4 schemas", () => {
    it("returns field errors with their messages", async () => {
      const resolver = zodResolver(loginSchema)
      const result = await resolver(
        { email: "not-an-email", password: "short" } as never,
        undefined,
        { fields: {}, shouldUseNativeValidation: false } as never,
      )
      expect(result.values).toEqual({})
      const errors = result.errors as Record<string, { message?: string }>
      expect(errors.email?.message).toBe("Please enter a valid email address")
      expect(errors.password?.message).toBe("Password must be at least 8 characters")
      expect(errors.role?.message).toBe("Please select a role")
    })
    it("returns parsed values and no errors for valid input", async () => {
      const resolver = zodResolver(loginSchema)
      const input = { email: "owner@example.com", password: "Passw0rdx", role: "owner" }
      const result = await resolver(input as never, undefined, {
        fields: {},
        shouldUseNativeValidation: false,
      } as never)
      expect(result.errors).toEqual({})
      expect(result.values).toEqual(input)
    })
  })
})
