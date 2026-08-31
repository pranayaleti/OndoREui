import type { ListingEmbed } from "@/lib/listing-presentation"

type ListingMediaEmbedProps = {
  embeds: ListingEmbed[]
}

export function ListingMediaEmbed({ embeds }: ListingMediaEmbedProps) {
  if (embeds.length === 0) return null

  return (
    <section aria-labelledby="listing-media-heading" className="mb-8">
      <h2 id="listing-media-heading" className="mb-3 text-xl font-semibold">
        Tours and video
      </h2>
      <ul className="grid gap-4">
        {embeds.map((embed) => (
          <li key={embed.embedSrc}>
            <p className="mb-2 text-sm font-medium text-muted-foreground">{embed.label}</p>
            <div className="aspect-video overflow-hidden rounded-xl border border-border bg-muted">
              <iframe
                src={embed.embedSrc}
                title={embed.label}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
