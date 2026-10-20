/**
 * Copy for /founders-letter/, the founder's story page, as typed data.
 *
 * Rules that keep the build green (lib/content/copy-lint.test.ts scans this file, the post-build
 * license scanner reads the exported HTML, lib/unverified-claims.test.tsx scans source):
 * - First person. Pranay by name or "I"; no third-person pronouns for the founder.
 * - No em dashes and none of the banned brand-voice words (brand-voice.md).
 * - Only verified facts. Years and counts come from the constants below and lib/social-proof-stats.
 * - Licensing is not live: never a real estate agent, loan officer, realtor or loan originator title
 *   near the name or in first person, no NMLS number. Services are offered through Ondo.
 * - Never date being a rental owner to the first home, and never hard-code the founding year or a
 *   count of properties: lib/unverified-claims.test.tsx scans for those literals.
 */
import { FOUNDED_MONTH_LABEL, FOUNDED_YEAR, UTAH_CITIES_SERVED } from "@/lib/social-proof-stats"
import { FOUNDER_PROFILE_PATH } from "@/lib/team-data"
import { SITE_ADDRESS_CITY, SITE_PHONE } from "@/lib/site"

export const ARRIVED_IN_US_YEAR = 2011
export const FIRST_YEAR_IN_SOFTWARE = 2013
export const FIRST_UTAH_HOME_YEAR = 2019
export const FIRST_CRYPTO_YEAR = 2018
export const FIRST_PARKS_YEAR = 2023
export const EB5_YEAR = 2024
export const VC_INVESTING_YEAR = 2025

/** Computed at build time; a static export shows the number as of its last build. */
export function yearsInSoftware(now: Date = new Date()): number {
  return now.getFullYear() - FIRST_YEAR_IN_SOFTWARE
}

export const FOUNDERS_LETTER_PATH = "/founders-letter/"
/** Carries the brand inside the head term, so pageTitle() does not append it again. */
export const FOUNDERS_LETTER_TITLE = "Founder's Letter: Why I Built Ondo Real Estate"
export const FOUNDER_IMAGE_PATH = "/founder-image.webp"
export const FOUNDER_IMAGE_ALT = "Pranay Reddy Aleti, founder of Ondo Real Estate"
export const ONDO_MARK_PATH = "/ondo-mark.webp"
export const ONDO_MARK_ALT =
  "The Ondo mark: Pranay Reddy Aleti's own silhouette drawn in fire inside a hand-painted brush ring"
export const FOUNDERS_LETTER_OG_IMAGE_PATH = "/founders-letter-og.jpg"
export const FOUNDERS_LETTER_OG_IMAGE_ALT = "The Ondo fire mark beside the founder's letter headline"

export const FOUNDERS_LETTER_HEADLINE =
  "I came to the United States to study computer science. I stayed to build something of my own."

export const FOUNDERS_LETTER_DESCRIPTION = `Pranay Reddy Aleti on ${yearsInSoftware()}+ years in software, the Utah house that changed the plan, and why Ondo Real Estate carries a fire in its logo. Founder-run in ${SITE_ADDRESS_CITY}.`

/** Inline copy: plain text, a link, or a phrase set in the brand orange. */
export type Segment = string | { text: string; href: string; external?: boolean } | { text: string; accent: true }

export type Block =
  | { kind: "p"; segments: Segment[] }
  | { kind: "habits"; items: { lead: string; text: string }[] }
  | { kind: "quote"; text: string }

export type Chapter = {
  id: string
  year: number
  title: string
  temp: "cool" | "neutral" | "warm"
  blocks: Block[]
  /** Short dated facts shown beside the chapter (also real text for the Markdown twin). */
  sideLabels?: string[]
}

const p = (...segments: Segment[]): Block => ({ kind: "p", segments })
const quote = (text: string): Block => ({ kind: "quote", text })
const accent = (text: string): Segment => ({ text, accent: true })

const years = yearsInSoftware()

export const LETTER = {
  masthead: {
    lead: "A letter from the founder of Ondo Real Estate, Utah.",
  },
  opening: {
    headline: FOUNDERS_LETTER_HEADLINE,
    deck: `I'm Pranay Reddy Aleti, founder of Ondo Real Estate in ${SITE_ADDRESS_CITY}, Utah. I shipped software for large companies for ${years}+ years. Then I bought a house here that was harder to buy than it needed to be, and I started a company with one rule: ON it. DO it. Here's the story, and what it means for your property.`,
    category: `Property management for Utah rental owners across ${UTAH_CITIES_SERVED} Wasatch Front cities. Buying, selling and home loans through Ondo while licensing is in progress.`,
    bookLabel: "Book a 30-minute call",
    callLabel: "Call Pranay",
    plateCaption: `Pranay Reddy Aleti. ${SITE_ADDRESS_CITY}, Utah.`,
  },
  lede: {
    blocks: [
      p("If you only read one paragraph, read this one."),
      p(
        `I'm an engineer who became a rental owner, then started a real estate company because the first two taught me what was broken. I still own and manage rental property myself, and since ${FIRST_PARKS_YEAR} I've put my own money into mobile home parks in Utah and Iowa and an investment property in Saratoga Springs. The repair calls, the lease questions and the year-end paperwork land on my phone the same way they land on yours.`,
      ),
      p(
        "Ondo Real Estate is founder-run. The person you talk to on day one is the one you call when something is off. I built the software underneath it: an owner portal and a tenant portal, with statements, maintenance and rent in one place.",
      ),
      p(
        "That's the short version. The rest of this page is how I got here, and why the name on the door is a promise I have to keep.",
      ),
    ],
  },
  chapters: [
    {
      id: "chapter-2011",
      year: ARRIVED_IN_US_YEAR,
      title: "I came for a degree. I left with a way of thinking.",
      temp: "cool",
      blocks: [
        p(
          `In ${ARRIVED_IN_US_YEAR} I came to the United States for a master's degree in computer science. I wasn't chasing a title. I wanted to understand how complicated things get built so they hold up under pressure.`,
        ),
        p(
          "Computer science changes how you think before it changes what you can build. Break the big problem into small ones. Write down what has to be true. Test it before you trust it. The system you can't explain is the system that fails at 2 a.m.",
        ),
        p(
          "That habit never left. Every process at Ondo, from how a repair request moves to how an owner statement gets built, starts with the question I learned to ask back then.",
        ),
        quote("What has to be true for this to work every single time?"),
      ],
    },
    {
      id: "chapter-2013",
      year: FIRST_YEAR_IN_SOFTWARE,
      title: `${years}+ years of shipping software that had to work.`,
      temp: "cool",
      blocks: [
        p(
          `From ${FIRST_YEAR_IN_SOFTWARE} I worked as a full stack engineer, building websites and digital products for large companies. I'm not going to list them here. What I can show you is what that work demands, and what it left me with.`,
        ),
        p(
          "At that scale nothing ships on a promise. It ships because it was planned, built, reviewed, tested and watched after launch. A form that fails for one person in a thousand is a bug, not a rounding error. A slow page costs real money.",
        ),
        p("Four habits from those years run Ondo today."),
        {
          kind: "habits",
          items: [
            { lead: "Execution.", text: "A plan is worth nothing until it ships. A deadline is a promise to a real person." },
            {
              lead: "Precision.",
              text: "The problem is always in the detail someone skipped. That's true of a lease, a statement and a move-in inspection too.",
            },
            {
              lead: "Reliability.",
              text: "Good systems are boring on purpose. You should never have to wonder whether rent was collected or a repair was closed.",
            },
            {
              lead: "The person on the other side.",
              text: "Every screen I built had someone behind it who was busy and short on patience. Owners and tenants are those people now.",
            },
          ],
        },
        p(
          "I also saw how well-run organizations work from the inside. They run on process and clear ownership, not heroics. When something breaks, they fix the cause, not the symptom, and they write down what changed so it doesn't break the same way twice. I brought that with me.",
        ),
        quote("You learn to care about the detail nobody thanks you for, because that detail is the product."),
      ],
    },
    {
      id: "chapter-2018",
      year: FIRST_CRYPTO_YEAR,
      title: "Betting on a system I understood.",
      temp: "cool",
      blocks: [
        p(
          `In ${FIRST_CRYPTO_YEAR} I bought ETH at $170. That was the year most people gave up on crypto. I didn't buy because of a headline. I bought because I'd spent years building software, and I understood what a network like Ethereum was trying to do.`,
        ),
        p(
          "It taught me to separate price from value. Prices move every day. What something is worth changes slowly, and you only see it if you understand how it works. I still follow that market closely, and I read a rental the same way: the rent, the repairs, the neighborhood, not the noise of a single month.",
        ),
        quote("Prices move every day. What something is worth changes slowly."),
      ],
    },
    {
      id: "chapter-2019",
      year: FIRST_UTAH_HOME_YEAR,
      title: "The house that changed the plan.",
      temp: "neutral",
      blocks: [
        p(
          `In ${FIRST_UTAH_HOME_YEAR} I bought my first home in Lehi, Utah. The process was harder than it needed to be. I'd spent years making complicated things feel simple for other people, and here was a process nobody had made simple for me.`,
        ),
        p(
          "When it was over, friends and family started asking for help with theirs. I helped them buy, place tenants and get to closing without the guesswork. Somewhere in there it stopped feeling like a favor and started feeling like the work I wanted to do.",
        ),
        p(
          "So I bought rental property of my own. Owning it taught me the other half: the repair that can't wait, the tenant who needs an answer today, the statement that has to be right in April.",
        ),
        p(
          "People call this a career change. I call it the first time the two things I care about lined up: building systems that work, and being the person responsible for them. Software is how I work. Real estate is where the people are. I chose it, and I made it the career instead of the side project.",
        ),
        quote("I didn't drift into real estate. I chose it."),
      ],
    },
    {
      id: `chapter-${FOUNDED_YEAR}`,
      year: FOUNDED_YEAR,
      title: "Two companies in one summer.",
      temp: "warm",
      sideLabels: [`May ${FOUNDED_YEAR}, OndoSoft`, `${FOUNDED_MONTH_LABEL} ${FOUNDED_YEAR}, Ondo Real Estate`],
      blocks: [
        p(
          `In May ${FOUNDED_YEAR} I started `,
          { text: "OndoSoft", href: "https://www.ondosoft.com/", external: true },
          `, my software consultancy. Two months later, in ${FOUNDED_MONTH_LABEL} ${FOUNDED_YEAR}, I founded Ondo Real Estate here in ${SITE_ADDRESS_CITY}. One for the code, one for the property.`,
        ),
        p(
          "No dressing this up. Starting a company is a long list of unglamorous decisions you have to get right with nobody checking your work. It means putting your own name where a corporate logo used to be, so the risk is yours too. I made that decision on purpose.",
        ),
        p(
          "Ondo started small, and it's still a company where the founder answers for the result. I started it because owners couldn't see what was happening with their own buildings, and tenants waited days for an answer on a repair.",
        ),
        p(
          "So I built the platform instead of buying one. I still own and manage rental property myself, which keeps me honest about how it feels from the owner's side. If you own a rental, ",
          { text: "here's how Ondo manages property", href: "/property-management/" },
          ".",
        ),
        quote("Those aren't people problems. They're system problems. Systems are what I do."),
      ],
    },
    {
      id: "chapter-2023",
      year: FIRST_PARKS_YEAR,
      title: "My own money, on the line.",
      temp: "warm",
      sideLabels: ["Mobile home park, Utah", "Mobile home park, Iowa", "Investment property, Saratoga Springs"],
      blocks: [
        p(
          `In ${FIRST_PARKS_YEAR} I put about $400,000 into two mobile home parks, one in Utah and one in Iowa. The same year I took on an investment property in Saratoga Springs.`,
        ),
        p(
          "Owning at that scale made real estate personal in a new way. A vacancy isn't a statistic when it hits your own numbers. Neither is a repair bill that lands the same week as the property tax. I read an owner's statement like an investor, because I am one.",
        ),
        quote("I read an owner's statement like an investor, because I am one."),
      ],
    },
    {
      id: "chapter-2024",
      year: EB5_YEAR,
      title: "Committing to stay.",
      temp: "warm",
      blocks: [
        p(
          `In ${EB5_YEAR} I invested about $1 million in a resort project in California and applied through the EB-5 program, which ties a green card application to an investment in an American business that creates jobs.`,
        ),
        p(
          `I came here in ${ARRIVED_IN_US_YEAR} as a student with a plan. Thirteen years later I put my own capital behind staying. That's the commitment under this company. I'm building Ondo for the long run, and the owners who work with Ondo get a founder who plans to be here.`,
        ),
      ],
    },
    {
      id: "chapter-2025",
      year: VC_INVESTING_YEAR,
      title: "Betting on Utah.",
      temp: "warm",
      sideLabels: ["Mobly", "EZ Salt", "Stratus"],
      blocks: [
        p(
          `Since ${VC_INVESTING_YEAR} I've been investing in startups as a venture investor, and strictly local: Utah companies only. Mobly, EZ Salt and Stratus are a few of them.`,
        ),
        p(
          "I'm huge on ",
          accent("Utah growth"),
          ". Every company that builds and hires here brings people who need a place to live, and owners who need their property run well. My money sits where my work is.",
        ),
      ],
    },
  ] satisfies Chapter[],
  mark: {
    heading: "Some brands choose a name. I wanted mine to represent a mindset.",
    lockup: ["ON it.", "DO it."],
    decode: "ON it is the response. DO it is the follow-through.",
    blocks: [
      p("Say the name out loud. Ondo. On it, do it."),
      p(
        "ON it is the first half of a promise: your problem has an owner now, and the owner is me. DO it is the second half: the work gets done, and you hear about it when it's done, not when you ask.",
      ),
      p(
        "Now look at the logo. A bearded figure drawn in fire, inside a ring painted by hand. The beard is mine. That silhouette is me, and the fire is why the company exists: a burning desire to serve better than I was served. I'd rather act than wait. The fire is the push to pick a problem up today and finish it, even when finishing is inconvenient.",
      ),
      p(
        "It isn't aggression, and it isn't speed for its own sake. The face is empty on purpose, so whatever you bring sits inside the outline: your building, your lease, your statement. The fire stays behind it, and it's what gets your repair closed and your statement out on time.",
      ),
      p(
        "That's why the name is on the door. Every time I write it, I'm signing a promise I have to keep.",
      ),
    ],
  },
  midCta: {
    text: "If that's how you want your property handled, let's talk.",
    bookLabel: "Book a 30-minute call",
    contactLabel: "Tell me about your property",
    contactHref: "/contact/?audience=owner",
  },
  why: {
    heading: "Why work with me. The case, not the slogans.",
    intro: "I won't tell you I'm the best. I'll tell you what the record shows, what I'm still building toward, and let you decide.",
    pillars: [
      {
        title: "A builder's mindset.",
        text: "When a process is clumsy, I don't file a complaint about it. I rebuild it. The owner and tenant portals exist because the tools I found didn't do what an owner needs.",
      },
      {
        title: "Problems get owned, not forwarded.",
        text: "An engineer's reflex is to find the root cause. A late payment, a repeat repair, a lease question that keeps coming back: each one is a problem to close, not a ticket to sit on.",
      },
      {
        title: "ON it. DO it. is the operating rule.",
        text: "You hear what happens next, and then it happens. When something can't be closed in one reply, that reply says what the next step is.",
      },
      {
        title: "My name is on it.",
        text: "There's no account manager between us. My own money is in real estate too, so I read your numbers the way I read mine. My reputation in Utah is small enough that I can't afford to lose it on your building.",
      },
      {
        title: "The system gets better every month.",
        text: "The statements, leases and maintenance flows in Ondo's software exist because something annoyed me first. When you tell me a step is painful, that's a feature request, and I'm the engineer who takes it.",
      },
      {
        title: "Technology for the boring parts, people for the rest.",
        text: "I use software where it removes friction and pick up the phone where it doesn't. No proprietary magic, and no promises about results I can't show you.",
      },
    ],
    ledger: {
      demonstratedLabel: "Demonstrated",
      demonstrated: [
        "A master's degree in computer science.",
        `${years}+ years as a full stack engineer for large companies.`,
        `A first home in Lehi, Utah, in ${FIRST_UTAH_HOME_YEAR}, then friends and family helped to closing and tenants placed.`,
        "Rental property I own and manage myself.",
        `About $400,000 of my own capital in two mobile home parks, in Utah and Iowa, in ${FIRST_PARKS_YEAR}, plus an investment property in Saratoga Springs.`,
        `About $1 million invested in a California resort project through the EB-5 program in ${EB5_YEAR}.`,
        `Venture investments in Utah startups only since ${VC_INVESTING_YEAR}, including Mobly, EZ Salt and Stratus.`,
        "A platform I built and run under the company.",
        `Two companies started in ${FOUNDED_YEAR}.`,
      ],
      inProgressLabel: "In progress",
      inProgress: [
        [`Growing a founder-run company across a service area of ${UTAH_CITIES_SERVED} Wasatch Front cities without lowering the standard.`],
        [
          "Real estate and mortgage licensing. Until it's active, buying, selling and loans go through Ondo. See ",
          { text: "licensing and disclosures", href: "/licensing/" },
          ".",
        ],
        ["Numbers worth publishing, once there are enough of them."],
      ] satisfies Segment[][],
    },
  },
  restraint: {
    heading: "What I will not claim",
    blocks: [
      p(
        "You won't find testimonials on this page, or a star rating, or a count of doors under management. When I have numbers I can stand behind, I'll publish them, and not before.",
      ),
      p(
        "Real estate and mortgage licensing is in progress. Until it's active, buying, selling and home loans go through Ondo, and where each line of business stands is on the ",
        { text: "licensing page", href: "/licensing/" },
        ". Property management is what Ondo does today, across the Wasatch Front.",
      ),
      p("I don't promise round-the-clock coverage. Office hours are Monday to Friday, 9 to 5 Mountain time, and we reply within one business day."),
      p("If any of this changes, this letter changes with it."),
    ],
  },
  closing: {
    heading: "This is the move.",
    blocks: [
      p(
        "If you own rental property on the Wasatch Front, or you're about to, book a 30-minute call. You tell me what isn't working and I tell you what I'd do about it. No pitch deck. If Ondo isn't the right fit, I'll say so and point you somewhere better.",
      ),
      p(
        "If you're ",
        { text: "renting", href: "/properties/" },
        ", ",
        { text: "buying", href: "/buy/" },
        " or ",
        { text: "selling", href: "/sell/" },
        ", book the same call. I'll tell you what Ondo can help with today and what waits on licensing. Bring the question you've been putting off.",
      ),
      p("Thank you for reading this far."),
      p("On it. Let's do it."),
    ],
    signature: {
      name: "Pranay Reddy Aleti",
      role: "Founder, Ondo Real Estate",
    },
    bookLabel: "Book a 30-minute call",
    callLabel: `Call ${SITE_PHONE}`,
    messageLabel: "Send a message",
  },
  keepReading: {
    heading: "Keep reading",
    links: [
      { label: "About Ondo Real Estate", href: "/about/" },
      { label: "How we manage property", href: "/property-management/" },
      { label: "Homes and rentals", href: "/properties/" },
      { label: "New to Utah", href: "/moving-to-utah/" },
      { label: "Pranay's full profile", href: FOUNDER_PROFILE_PATH },
      { label: "Licensing and disclosures", href: "/licensing/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
} as const

function segmentsText(segments: readonly Segment[]): string {
  return segments.map((s) => (typeof s === "string" ? s : s.text)).join("")
}

function blocksText(blocks: readonly Block[]): string[] {
  return blocks.map((b) => {
    if (b.kind === "p") return segmentsText(b.segments)
    if (b.kind === "quote") return b.text
    return b.items.map((i) => `${i.lead} ${i.text}`).join(" ")
  })
}

/** Every reader-facing string on the page, in order, for word counts and the voice and claim scans. */
export function founderLetterText(): string {
  const { masthead, opening, lede, chapters, mark, midCta, why, restraint, closing, keepReading } = LETTER
  const parts: string[] = [
    masthead.lead,
    opening.headline,
    opening.deck,
    opening.category,
    opening.bookLabel,
    opening.callLabel,
    opening.plateCaption,
    ...blocksText(lede.blocks),
  ]
  for (const chapter of chapters) {
    parts.push(`${chapter.year}: ${chapter.title}`, ...blocksText(chapter.blocks), ...(chapter.sideLabels ?? []))
  }
  parts.push(mark.heading, mark.lockup.join(" "), mark.decode, ...blocksText(mark.blocks))
  parts.push(midCta.text, midCta.bookLabel, midCta.contactLabel)
  parts.push(why.heading, why.intro, ...why.pillars.map((pillar) => `${pillar.title} ${pillar.text}`))
  parts.push(why.ledger.demonstratedLabel, ...why.ledger.demonstrated, why.ledger.inProgressLabel, ...why.ledger.inProgress.map(segmentsText))
  parts.push(restraint.heading, ...blocksText(restraint.blocks))
  parts.push(closing.heading, ...blocksText(closing.blocks), closing.signature.name, closing.signature.role)
  parts.push(closing.bookLabel, closing.callLabel, closing.messageLabel)
  parts.push(keepReading.heading, ...keepReading.links.map((link) => link.label))
  return parts.join("\n")
}

export function founderLetterWordCount(): number {
  return founderLetterText().split(/\s+/).filter(Boolean).length
}
