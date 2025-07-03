'use client';
// import { MusicStreamList } from "@/components/music-stream-list"
// import { SiteHeader } from "@/components/site-header"
// import { Sidebar } from "@/components/sidebar"
// import { AddStreamButton } from "@/components/add-stream-button"
import { FooterSection } from "@/components/FooterSection"
// import { ExpandableCardDemo } from "@/components/ui/expandable-card"
import { CreatorDashboard } from "@/components/Dashboard"

import { NavBar } from "@/components/navBar";

export default function Dashboard() {
  return (
    <div>
       <NavBar />
    <div className="flex flex-col min-h-screen bg-background mt-10">
      <div className="flex min-h-screen bg-background text-foreground">
        <CreatorDashboard/>
      </div>
      <FooterSection />
    </div> 
    </div>
  )
}


