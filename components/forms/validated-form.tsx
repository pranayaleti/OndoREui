"use client"

import React from "react"
import { useForm, UseFormReturn, FieldValues, Path, DefaultValues, SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { LoadingSpinner } from "@/components/loading-states"

interface ValidatedFormProps<T extends FieldValues> {
  schema: z.ZodType<T, T>
  onSubmit: SubmitHandler<T>
  children: (form: UseFormReturn<T>) => React.ReactNode
  defaultValues?: DefaultValues<T>
  className?: string
  submitText?: string
  isLoading?: boolean
}

export function ValidatedForm<T extends FieldValues>({
  schema,
  onSubmit,
  children,
  defaultValues,
  className = "",
  submitText = "Submit",
  isLoading = false,
}: ValidatedFormProps<T>) {
  const form = useForm<T>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues,
    mode: "onChange",
  })

  const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      await onSubmit(data)
    } catch (error) {
      console.error("Form submission error:", error)
      // Set form error state
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "An error occurred. Please try again.",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {children(form)}
        {form.formState.errors.root && (
          <div className="rounded-md bg-muted p-4 mb-4">
            <div className="text-sm text-red-700">
              {form.formState.errors.root.message}
            </div>
          </div>
        )}
        <div className="flex justify-end space-x-2 pt-4">
          <Button
            type="submit"
            disabled={isLoading || !form.formState.isValid}
            className="min-w-[100px]"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Submitting...
              </>
            ) : (
              submitText
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}

// Reusable form field component
interface FormFieldProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  description?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "number" | "tel" | "url"
  required?: boolean
  disabled?: boolean
}

export function FormFieldComponent<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
}: FormFieldProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Reusable textarea field component
interface FormTextareaProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  description?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  rows?: number
}

export function FormTextareaComponent<T extends FieldValues>({
  form,
  name,
  label,
  description,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
}: FormTextareaProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <textarea
              {...field}
              placeholder={placeholder}
              disabled={disabled}
              rows={rows}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed resize-vertical"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Reusable select field component
interface FormSelectProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
  options: Array<{ value: string; label: string }>
  placeholder?: string
}

export function FormSelectComponent<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
  options,
  placeholder = "Select an option",
}: FormSelectProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <select
              {...field}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-muted disabled:cursor-not-allowed"
            >
              <option value="">{placeholder}</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

// Reusable checkbox field component
interface FormCheckboxProps<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  label: string
  description?: string
  required?: boolean
  disabled?: boolean
}

export function FormCheckboxComponent<T extends FieldValues>({
  form,
  name,
  label,
  description,
  required = false,
  disabled = false,
}: FormCheckboxProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              disabled={disabled}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded disabled:bg-muted disabled:cursor-not-allowed"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  )
}

export default ValidatedForm
