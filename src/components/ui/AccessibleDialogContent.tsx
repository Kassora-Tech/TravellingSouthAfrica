
"use client";

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function AccessibleDialogContent({
  title,
  description,
  children,
  className = "",
  ...props
}) {
  return (
    <DialogContent
      className={cn("max-w-lg w-full rounded-2xl p-6 sm:p-8", className)}
      {...props}
    >
      <DialogHeader className="space-y-2">
        {title && (
          <DialogTitle className="text-xl font-semibold">
            {title}
          </DialogTitle>
        )}

        {/* Accessible description (fallback if none provided) */}
        <DialogDescription className={description ? "" : "sr-only"}>
          {description || "Dialog window"}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4">
        {children}
      </div>
    </DialogContent>
  );
}
