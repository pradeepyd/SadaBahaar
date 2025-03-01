import { Music, Share2, Sparkles, ThumbsUp } from "lucide-react"
import { Card, CardContent } from "./ui/card"



export default function HowItWorks  ()  {
    return <div>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">How It Works</h2>
              <p className="max-w-[700px] text-gray-500 md:text-lg dark:text-gray-400">
                Create interactive streams in four easy steps
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 mt-12">
              <StepCard
                number="01"
                icon={<Music className="h-5 w-5" />}
                title="Create Your Stream"
                description="Set up your stream with our intuitive interface."
              />
              <StepCard
                number="02"
                icon={<Share2 className="h-5 w-5" />}
                title="Share With Fans"
                description="Invite your audience with a unique link."
              />
              <StepCard
                number="03"
                icon={<ThumbsUp className="h-5 w-5" />}
                title="Let Fans Vote"
                description="Audience votes on songs in real-time."
              />
              <StepCard
                number="04"
                icon={<Sparkles className="h-5 w-5" />}
                title="Enjoy the Experience"
                description="Build connections through shared music."
              />
            </div>
          </div>
        </section>
        </div>
}

function StepCard({
    number,
    icon,
    title,
    description,
  }: {
    number: string
    icon: React.ReactNode
    title: string
    description: string
  }) {
    return (
      <Card className="transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-purple-500">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white">
              {icon}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{number}</span>
                <h3 className="font-bold">{title}</h3>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }