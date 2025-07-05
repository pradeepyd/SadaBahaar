"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Music } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { SignUpButton, useAuth, useClerk } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";

export function NavBar() {
  const { userId } = useAuth();
  const { signOut } = useClerk();
  
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Music className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <span className="hidden font-bold text-purple-900 dark:text-purple-50 sm:inline-block">
              FanMix
            </span>
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

          {userId && (
            <Button
              variant="ghost"
              className="bg-gray-600/50 hover:bg-gray-500/70 text-gray-100 hover:text-white border border-gray-600/50"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              Log Out
            </Button>
          )}
          {!userId && (
            <SignInButton>
              <Button
                variant="ghost"
                className="bg-purple-900/20 hover:bg-purple-900/40 text-purple-400 hover:text-purple-300 border border-purple-500/30"
              >
                Log In
              </Button>
            </SignInButton>
          )}
          {!userId && <SignUpButton>
            <Button className="bg-purple-600 text-white hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600">
              Sign Up
            </Button>
          </SignUpButton>}
        </div>
      </div>
    </header>
  );
}
