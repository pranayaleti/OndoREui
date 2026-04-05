import Link from "next/link"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight } from "lucide-react"

type CrossLink = {
  label: string
  href: string
}

type CrossLinkSectionProps = {
  title: string
  links: CrossLink[]
  variant: "grid" | "pills"
}

export function CrossLinkSection({ title, links, variant }: CrossLinkSectionProps) {
  if (!links.length) return null

  return (
    <section>
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {variant === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardHeader className="py-3 px-4">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {links.map((link) => (
            <Link key={link.href} href={link.href}>
              <Badge
                variant="outline"
                className="text-sm py-1.5 px-3 hover:bg-muted/50 transition-colors cursor-pointer"
              >
                {link.label}
              </Badge>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}
