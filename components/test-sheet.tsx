"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

export function TestSheet() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Test Sheet</Button>
      </SheetTrigger>
      <SheetContent className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>Test Sheet</SheetTitle>
          <SheetDescription>This is a test sheet to verify functionality</SheetDescription>
        </SheetHeader>
        <div className="py-6 space-y-6 overflow-y-auto max-h-[calc(100vh-180px)]">
          <p>This is a test sheet to verify that the Sheet component is working correctly.</p>
          <p>If you can see this content, the Sheet component is functioning properly.</p>
          <div className="h-[1000px] bg-muted dark:bg-muted rounded-md p-4">
            <p>This is a tall element to test scrolling.</p>
            <p className="mt-[900px]">You should be able to scroll down to see this text.</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
