import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TOPIC_CLUSTERS, getContentNode, nodesInCluster } from "@/lib/content"

export function TopicHubGrid() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {TOPIC_CLUSTERS.map((cluster) => {
        const pillar = getContentNode(cluster.pillarId)
        const guides = nodesInCluster(cluster.id).filter((node) => node.kind === "guide").slice(0, 5)
        if (!pillar) return null
        return (
          <Card key={cluster.id} className="h-full border-border">
            <CardHeader>
              <CardTitle>
                <Link href={pillar.path} className="hover:text-primary">
                  {cluster.title}
                </Link>
              </CardTitle>
              <CardDescription>{cluster.description}</CardDescription>
              {guides.length > 0 ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/70">
                  {guides.map((guide) => (
                    <li key={guide.id}>
                      <Link href={guide.path} className="text-primary underline-offset-4 hover:underline">
                        {guide.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </CardHeader>
          </Card>
        )
      })}
    </div>
  )
}
