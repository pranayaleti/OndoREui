/**
 * Public team roster. Only real people who have agreed to be listed belong here.
 * Do not add titles, license numbers, years of experience, photos or personal
 * mailboxes that are not verified (contact goes through /contact/): the loan pages render this list, so a
 * mortgage-related title also needs an NMLS ID (see lib/site.ts).
 */
export type TeamMember = {
  name: string
  slug: string
  title: string
  bio: string
}

export const teamMembers: TeamMember[] = [
  {
    name: "Pranay Reddy Aleti",
    slug: "pranay-reddy-aleti",
    title: "Founder",
    bio: "Pranay founded Ondo Real Estate and built the platform behind the owner and tenant portals. He started in software and moved into real estate, and he still works with clients directly.",
  },
]

export function getTeam(): TeamMember[] {
  return teamMembers
}

export function findTeamMemberBySlug(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug)
}
