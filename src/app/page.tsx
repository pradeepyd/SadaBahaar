import type React from "react"

import { SiteHeader } from "@/components/navBar"
import Hero from "@/components/Herosection"
import FeatureSection from "@/components/FeatureSection"
import HowItWorks from "@/components/Howitworks"
import { CTAsection } from "@/components/CTAsection"
import { FooterSection } from "@/components/FooterSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <main className="flex-grow">
        <Hero/>
        <FeatureSection/>
        <HowItWorks/>
        <CTAsection/>
      </main>
      <FooterSection/>
    </div>
  )
}







