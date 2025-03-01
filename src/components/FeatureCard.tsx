import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"



export default function FeatureCard({
    icon,
    title,
    description,
    gradient,
  }: {
    icon: React.ReactNode
    title: string
    description: string
    gradient: string
  }) {
    return (
      <Card className="relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-purple-500">
        <div className={`absolute inset-0 opacity-5 bg-gradient-to-br ${gradient}`} />
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`rounded-lg p-2 bg-gradient-to-br ${gradient} text-white`}>{icon}</div>
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </CardContent>
      </Card>
    )
}