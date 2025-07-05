import { ChevronRight, Music } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import Link from "next/link"


export function CTAsection(){
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <div className="container px-4 md:px-6">
          <Card className="mx-auto max-w-3xl bg-white dark:bg-gray-900">
            <CardContent className="p-8">
              <div className="flex flex-col items-center space-y-4 text-center">
                <Music className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold">Ready to Transform Your Streams?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Connect with your audience in a meaningful way.
                </p>
                <div className="space-y-4 pt-4">
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-3xl font-bold">$9</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">/month</div>
                  </div>
                  <ul className="space-y-2 text-left text-sm">
                    <FeatureItem>Unlimited streams</FeatureItem>
                    <FeatureItem>Real-time voting</FeatureItem>
                    <FeatureItem>Audience analytics</FeatureItem>
                    <FeatureItem>Priority support</FeatureItem>
                  </ul>
                  <Link
                    href="/signup"
                    className="inline-flex h-10 w-full items-center justify-center rounded-md bg-gradient-to-r from-purple-600 to-indigo-600 px-8 text-sm font-medium text-white shadow transition-all hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    Get Started
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No credit card required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
}

function FeatureItem({ children }: { children: React.ReactNode }) {
    return (
      <li className="flex items-center space-x-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-4 w-4 text-green-500"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25z"
            clipRule="evenodd"
          />
        </svg>
        <span>{children}</span>
      </li>
    )
  }