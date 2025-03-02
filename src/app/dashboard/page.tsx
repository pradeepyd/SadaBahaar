import { MusicStreamList } from "@/components/music-stream-list"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { AddStreamButton } from "@/components/add-stream-button"
import { FooterSection } from "@/components/FooterSection"
import { ExpandableCardDemo } from "@/components/ui/expandable-card"
import { CreatorDashboard } from "@/components/Dashboard"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <div className="flex-grow container grid grid-cols-1 md:grid-cols-4 gap-6 py-8">
        <Sidebar className="hidden md:block" />
        <main className="col-span-1 md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Trending Streams</h1>
            <AddStreamButton />
          </div>
          <MusicStreamList />
          <CreatorDashboard/>
          <ExpandableCardDemo/>
        </main>
      </div>
      <FooterSection />
    </div>
  )
}


