"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Music } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"

export function SiteHeader() {

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="hidden font-bold text-purple-900 dark:text-purple-50 sm:inline-block">FanMix</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="#features"
              className="transition-colors hover:text-purple-900 text-purple-600 dark:text-purple-400 dark:hover:text-purple-50"
            >
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="transition-colors hover:text-purple-900 text-purple-600 dark:text-purple-400 dark:hover:text-purple-50"
            >
              How It Works
            </Link>
            <Link
              href="/pricing"
              className="transition-colors hover:text-purple-900 text-purple-600 dark:text-purple-400 dark:hover:text-purple-50"
            >
              Pricing
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <ThemeToggle />
          <Button
            variant="ghost"
            className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-50"
          >
            <Link href="/login">Log In</Link>
          </Button>
          <Button className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

