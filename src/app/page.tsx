import type React from "react"

import { SiteHeader } from "@/components/site-header"
import Hero from "@/components/Herosection"
import FeatureSection from "@/components/FeatureSection"
import HowItWorks from "@/components/Howitworks"
import { CTAsection } from "@/components/CTAsection"
import { FooterSection } from "@/components/FooterSection"
import { UserNav } from "@/components/user-nav"
import { Redirect } from "@/components/Redirect"

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeader />
      <Redirect/>
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







