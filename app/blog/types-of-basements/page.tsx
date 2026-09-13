import Link from "next/link"
import { ArticleShell, articleMetadata } from "@/components/content/article-shell"

const path = "/blog/types-of-basements"

const faqs = [
  {
    question: "What's the difference between a walkout and a walk-up basement?",
    answer:
      "Both sit below grade with an exterior exit. A walkout is built into a sloped lot, so a door opens straight onto the yard at ground level. A walk-up is on flatter ground, so you climb an enclosed stairwell to reach the yard instead. Same idea, different lot.",
  },
  {
    question: "Does a basement bedroom need a window?",
    answer:
      "Yes. Any room used as a bedroom needs an IRC-compliant egress window well, full stop, no matter what the listing or the seller calls the room. No egress window means no legal bedroom, and that affects both appraised value and whether it holds up in a fire-code inspection.",
  },
  {
    question: "Is a crawlspace a basement?",
    answer:
      "No. A crawlspace is a shallow gap under the main floor built for utility and plumbing access, not for people. It's not usable living space and shouldn't be marketed as bonus square footage. Moisture is the thing to check: standing water or a missing vapor barrier is a mold problem waiting to happen.",
  },
  {
    question: "What's the difference between a full and partial basement?",
    answer:
      "A full basement runs under the entire footprint of the house and can hold real living space, bedrooms, an office, a gym. A partial basement covers only part of the house, usually just enough for the furnace, water heater, and utility hookups, not built to live in.",
  },
  {
    question: "Do houses with no basement have problems?",
    answer:
      "Not necessarily. A slab-foundation house skips basement stairs and flood risk entirely. The tradeoff is that utilities and HVAC equipment sit on the main floor instead of below it, which means more mechanical noise near living space and no underground storm shelter if your area needs one.",
  },
]

export const metadata = articleMetadata({
  path,
  title: "Types of Basements: What Each One Actually Means for Your Home",
  description:
    "Full, partial, walkout, walk-up, daylight, and crawlspace. Six basement types explained, including the egress rule that decides if a basement room is a legal bedroom.",
  published: "2026-09-13",
  category: "Buying Guide",
  keywords: [
    "types of basements",
    "walkout basement",
    "walk-up basement",
    "daylight basement",
    "english basement",
    "full basement vs partial basement",
    "basement egress window requirements",
    "crawl space vs basement",
  ],
  faqs,
})

export default function TypesOfBasementsPage() {
  return (
    <ArticleShell
      meta={{
        path,
        title: "Types of Basements: What Each One Actually Means for Your Home",
        description:
          "Full, partial, walkout, walk-up, daylight, and crawlspace. Six basement types explained, including the egress rule that decides if a basement room is a legal bedroom.",
        published: "2026-09-13",
        category: "Buying Guide",
        bannerSubtitle:
          "\"Basement\" on a listing is doing a lot of work it shouldn't get away with. Here's what each type actually gives you.",
        image: "/suburban-house-garden.webp",
        faqs,
        keywords: ["types of basements", "walkout basement", "daylight basement", "basement egress window"],
      }}
    >
      <p className="lead text-xl text-foreground/70">
        Most listings just say &quot;basement&quot; and stop there. That single word is covering six different
        setups, and each one changes what you&apos;re actually buying, financing, or managing. Here&apos;s the
        breakdown.
      </p>

      <h2>Full basement</h2>
      <p>
        Runs under the entire footprint of the house. This is the one that can carry real square footage: bedrooms,
        a guest suite, a home office, a gym. But there&apos;s a rule that trips people up constantly. Any bedroom
        down there needs an <strong>IRC-compliant egress window well</strong>, full stop. No egress window, no legal
        bedroom, no matter what the listing calls it. Check local code before you count that space as bedrooms in
        your head or your offer.
      </p>

      <h2>Partial basement</h2>
      <p>
        Covers only part of the house. Usually built to hold the furnace, water heater, and utility hookups, not to
        live in. The upside is real: it isolates mechanical noise from the rest of the house and gives you a storm
        shelter without the cost of excavating under the entire slab.
      </p>

      <h2>Walkout basement</h2>
      <p>
        Built into a sloped lot so one wall opens straight to grade, usually with a door to the backyard. More
        natural light, easier ventilation, and higher resale value than a fully buried basement. The tradeoff is
        water. The grade needs to slope away from the house, and the exterior drainage has to actually work, because
        a walkout is the first place a bad grading job shows up as a flooded room.
      </p>

      <h2>Walk-up basement</h2>
      <p>
        Same idea as a walkout, different lot. On flat ground, so instead of a door at grade you get an enclosed
        stairwell leading up to the yard. Similar upside, but that stairwell and landing need to stay clear of
        debris, leaves, and ice in winter. It&apos;s a small maintenance line item that gets ignored until someone&apos;s
        carrying groceries down icy steps.
      </p>

      <h2>Daylight (English) basement</h2>
      <p>
        A variation on the walkout, usually on a lot with a partial slope. Part of the basement wall sits above
        grade with full-size windows, so the space gets real daylight even though it&apos;s technically below the
        main floor. Sometimes finished as a separate living unit with its own entrance, which is where the term
        &quot;garden-level apartment&quot; comes from. Treat it like a walkout for inspection purposes: the same
        grading and drainage questions apply.
      </p>

      <h2>Crawlspace</h2>
      <p>
        Not a basement. A shallow gap under the main floor, built for utility and plumbing access, not for people.
        Don&apos;t let anyone market this as bonus space. What matters here is moisture. A crawlspace with standing
        water or no vapor barrier is a mold problem waiting to happen, and it&apos;s cheap to inspect and expensive
        to ignore.
      </p>

      <h2>No basement (slab foundation)</h2>
      <p>
        The house sits directly on a concrete slab. No stairs, no flood risk from a basement, simpler build. The
        cost is that utilities and HVAC equipment live on the main floor instead, which means more noise near living
        space and no underground storm shelter if you&apos;re somewhere that needs one.
      </p>

      <h2>What actually matters when you're looking</h2>
      <p>Two things separate a good basement from a liability, and neither one is on the listing photos.</p>
      <ol>
        <li>
          <strong>Water.</strong> Stains, dampness, a musty smell, visible mold. That&apos;s not cosmetic, that&apos;s
          a foundation and drainage story you need before you write an offer, not after.
        </li>
        <li>
          <strong>Code.</strong> A finished basement bedroom without a proper egress window isn&apos;t a bedroom in
          any way that holds up to an appraiser, an inspector, or a fire code. Sellers list it as one anyway. Don&apos;t
          take their word for it.
        </li>
      </ol>

      <h2>Why this matters if you're managing the property</h2>
      <p>
        For an owner or a property manager, basement type isn&apos;t trivia, it&apos;s underwriting. A walkout with
        strong drainage adds real rentable square footage and real rent. A partial basement with a loud furnace six
        feet from a bedroom wall is a maintenance ticket you&apos;ll see every winter. Know which one you&apos;ve got
        before you price the unit or plan the renovation, not after a tenant calls about water in the carpet. If
        you&apos;re running the numbers on a purchase either way, the{" "}
        <Link href="/calculators/affordability">affordability calculator</Link> and{" "}
        <Link href="/calculators">full calculator suite</Link> are on us.
      </p>

      <p>
        Already own the place and thinking about finishing it out? See{" "}
        <Link href="/blog/finishing-basement-roi">what a finished basement actually costs and returns</Link>{" "}
        before you frame a single wall.
      </p>
    </ArticleShell>
  )
}
