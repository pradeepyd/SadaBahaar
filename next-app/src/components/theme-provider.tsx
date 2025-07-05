"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider  attribute="class" // Ensures dark mode is applied properly
  defaultTheme="system" // Uses user's system preference
  enableSystem
  {...props}>{children}</NextThemesProvider>
}

