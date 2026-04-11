"use client"

import React from "react"
import Link from "next/link"
import Image from "next/image"
import { User, Building2, Lightbulb, TrendingUp, Handshake, Rocket, Code, Home, Zap, Target } from "lucide-react"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"

export default function FoundersLetterPage() {
  const currentYear = new Date().getFullYear();
  const yearsInTech = currentYear - 2013;
  const yearsInUtah = currentYear - 2019;

  return (
    <div className="min-h-screen bg-background dark:bg-transparent" aria-labelledby="founders-letter-heading">
      <SEO
        title="Founder's Letter | Ondo Real Estate"
        description="A personal letter from the founder of Ondo Real Estate on our mission, values, and the future of property management."
        pathname="/founders-letter"
        image={`${SITE_URL}/founder-image.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Founder's Letter", url: `${SITE_URL}/founders-letter` },
        ])}
      />
      <div className="relative bg-gradient-to-br from-[var(--gradient-from)] via-[var(--color-gradient-via)] to-[var(--color-gradient-to)]">
        <div className="absolute inset-0 bg-background opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <h1
            id="founders-letter-heading"
            className="text-6xl md:text-7xl font-bold text-foreground mb-6"
          >
            A Letter From the <span className="text-primary">Founder</span>
          </h1>
          <p className="text-2xl text-foreground/70 max-w-3xl">
            From software engineering to real estate innovation - discover the story behind
            Ondo Real Estate and our mission to revolutionize property management.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div className="bg-primary bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-primary">
              <div className="text-4xl font-bold text-foreground">{yearsInTech}+</div>
              <div className="text-foreground mt-2">Years in Tech</div>
              <div className="text-foreground/70 text-sm">Full Stack Development</div>
            </div>
            <div className="bg-primary bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-primary">
              <div className="text-4xl font-bold text-foreground">{yearsInUtah}+</div>
              <div className="text-foreground mt-2">Years in Utah</div>
              <div className="text-foreground/70 text-sm">Local Market Expert</div>
            </div>
            <div className="bg-primary bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-primary">
              <div className="text-4xl font-bold text-foreground">100%</div>
              <div className="text-foreground mt-2">Client Focused</div>
              <div className="text-foreground/70 text-sm">Personal Touch</div>
            </div>
            <div className="bg-primary bg-opacity-20 backdrop-blur-lg rounded-lg p-6 border border-primary">
              <div className="text-4xl font-bold text-foreground">24/7</div>
              <div className="text-foreground mt-2">Tech Platform</div>
              <div className="text-foreground/70 text-sm">Always Available</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-card rounded-xl p-8 border border-border">
            <header className="flex items-center mb-6">
              <User className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
              <h2 className="text-3xl font-bold text-foreground">Meet the Founder</h2>
            </header>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                <div className="relative h-32 w-32 rounded-full border-4 border-primary overflow-hidden flex-shrink-0" aria-hidden="true">
                  <Image 
                    src="/founder-image.png" 
                    alt="Pranay Reddy Aleti, Founder and CEO of Ondo Real Estate, professional headshot" 
                    fill 
                    style={{ objectFit: "cover" }}
                    className="rounded-full"
                    quality={100}
                    priority
                    sizes="(max-width: 768px) 128px, 128px"
                    title="Pranay Reddy Aleti - Ondo Real Estate Founder"
                    aria-label="Professional headshot of Pranay Reddy Aleti, Founder and CEO of Ondo Real Estate"
                  />
                </div>
                <div>
                  <p className="text-foreground/70 text-lg leading-relaxed">
                    Hi, I'm <strong className="text-primary">Pranay Reddy Aleti</strong>.
                  </p>
                </div>
              </div>
              <p className="text-foreground/70 text-lg leading-relaxed">
                When I first came to the U.S. to pursue my <strong className="text-primary">Master's degree in computer science</strong>, I
                thought my life would stay rooted in software engineering. I've spent over a decade building applications, solving
                problems, and writing code that powers businesses. But somewhere along the way, I realized something important: while I
                love technology, what truly excites me is <strong className="text-primary">real estate</strong> - because real estate is about
                people, growth, and legacy.
              </p>
            </div>

            <section
              className="bg-card rounded-xl p-8 border border-border"
              aria-labelledby="founders-journey-heading"
            >
              <header className="flex items-center mb-6">
                <TrendingUp className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="founders-journey-heading" className="text-3xl font-bold text-foreground">
                  The Journey
                </h2>
              </header>
              <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                As an immigrant, homeowner, and now a <strong className="text-primary">real estate professional in Utah</strong>, I know
                firsthand how much real estate impacts people's lives. It's not just about transactions; it's about finding stability,
                building wealth, and creating opportunities. That belief is what led me to start <strong className="text-primary">Ondo Real
                Estate</strong>.
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                I purchased my first home in <strong className="text-primary">2019</strong>, that experience sparked something in me. Since then, I've been helping friends and family purchase their own homes, place tenants, and navigate the real estate journey confidently.
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                What started as a personal passion evolved into a full-time vision: to invest in real estate and eventually dedicate my career to it. In early <strong className="text-primary">2022</strong>, I launched both <a href="https://ondosoft.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-semibold decoration-2 underline-offset-2 transition-colors">OndoSoft</a> and <strong className="text-primary">Ondo Real Estate</strong>, blending technology and real estate innovation.
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Around the same time, I began building this very website — a continuous work in progress that evolves as I do. Every update reflects a step forward in our mission to make property management smarter, more transparent, and deeply human.
              </p>
            </section>

            <section
              className="bg-card rounded-xl p-8 border border-border"
              aria-labelledby="why-ondo-heading"
            >
              <header className="flex items-center mb-6">
                <Lightbulb className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="why-ondo-heading" className="text-3xl font-bold text-foreground">
                  Why Ondo?
                </h2>
              </header>
              <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                "Ondo" means <em className="text-primary">foundation and rhythm.</em> To me, real estate is exactly that - the foundation for
                families and the rhythm that keeps communities thriving. I created Ondo because I saw a gap: property management was stuck in
                the past, weighed down by inefficiency, poor communication, and outdated systems.
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Owners were frustrated. Tenants were frustrated. And with my background in <strong className="text-primary">technology</strong>,
                I knew there was a better way.
              </p>
            </section>

            <section
              className="bg-card rounded-xl p-8 border border-border"
              aria-labelledby="our-mission-heading"
            >
              <header className="flex items-center mb-6">
                <Rocket className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="our-mission-heading" className="text-3xl font-bold text-foreground">
                  Our Mission
                </h2>
              </header>
              <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                Ondo isn't just another property management company - it's a <strong className="text-primary">modern platform built on trust,
                transparency, and technology.</strong> My goal is simple: make property ownership stress-free, and make renting a home feel fair
                and effortless.
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed">
                I want owners to feel confident that their investments are taken care of, and tenants to feel like they're more than just a
                number in a system. We're building the future of property management, one relationship at a time.
              </p>
            </section>

            <section
              className="bg-card rounded-xl p-8 border border-border"
              aria-labelledby="personal-note-heading"
            >
              <header className="flex items-center mb-6">
                <Handshake className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="personal-note-heading" className="text-3xl font-bold text-foreground">
                  A Personal Note
                </h2>
              </header>
              <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                I'm not building Ondo from a distance - I live this. I own and manage rental property myself, so I understand the real challenges on
                both sides. I've also taken risks, whether in <strong className="text-primary">real estate, technology, or investing in the
                future of cryptocurrency.</strong>
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Risk has taught me resilience, and resilience is what drives me to build something bigger than just another business. At the end
                of the day, Ondo is about <strong className="text-primary">creating long-term value</strong> - for owners, for tenants, and for the
                communities we serve.
              </p>
            </section>

            <section
              className="bg-card rounded-xl p-8 border border-border"
              aria-labelledby="looking-ahead-heading"
            >
              <header className="flex items-center mb-6">
                <Building2 className="text-primary h-7 w-7 mr-4" aria-hidden="true" />
                <h2 id="looking-ahead-heading" className="text-3xl font-bold text-foreground">
                  Looking Ahead
                </h2>
              </header>
              <p className="text-foreground/70 text-lg leading-relaxed mb-4">
                I believe the future of real estate lies in combining <strong className="text-primary">human connection</strong> with
                <strong className="text-primary"> technology.</strong> That's what Ondo stands for. And if you're reading this, I'd love for you
                to be part of that journey - whether you're an owner looking for smarter management, a tenant searching for a great home, or a
                partner who believes in innovation.
              </p>
              <p className="text-foreground/70 text-lg leading-relaxed">
                Thank you for being here. The future is bright, and this is just the beginning.
              </p>
            </section>

            <div className="bg-gradient-to-r from-[var(--color-gradient-to)] to-background rounded-xl p-8 border border-primary">
              <p className="text-foreground/70 text-lg mb-4">Sincerely,</p>
              <div className="text-2xl font-bold text-foreground mb-2">Pranay Reddy Aleti</div>
              <div className="text-primary font-semibold">Founder, Ondo Real Estate</div>
            </div>
          </div>

          <div className="space-y-6">
            <section
              className="bg-card rounded-xl p-6 border border-border"
              aria-labelledby="core-values-heading"
            >
              <h3 id="core-values-heading" className="text-xl font-bold text-primary mb-4">
                Core Values
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <span className="text-primary mr-3">✓</span>
                  <span className="text-foreground/70">Innovation First</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-3">✓</span>
                  <span className="text-foreground/70">Client Success</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-3">✓</span>
                  <span className="text-foreground/70">Transparency</span>
                </div>
                <div className="flex items-center">
                  <span className="text-primary mr-3">✓</span>
                  <span className="text-foreground/70">Community Focus</span>
                </div>
              </div>
            </section>

            <section
              className="bg-card rounded-xl p-6 border border-border"
              aria-labelledby="expertise-heading"
            >
              <h3 id="expertise-heading" className="text-xl font-bold text-primary mb-4">
                Expertise
              </h3>
              <div className="space-y-3">
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-foreground font-semibold">Full Stack Development</div>
                  <div className="text-foreground/70 text-sm">React, Node.js, Modern Web Apps</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-foreground font-semibold">Real Estate Investment</div>
                  <div className="text-foreground/70 text-sm">Utah Market Specialist</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-foreground font-semibold">Property Management</div>
                  <div className="text-foreground/70 text-sm">Owner & Tenant Relations</div>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <div className="text-foreground font-semibold">Technology Integration</div>
                  <div className="text-foreground/70 text-sm">AI & Automation Solutions</div>
                </div>
              </div>
            </section>

            <section
              className="bg-gradient-to-r from-[var(--color-gradient-to)] to-background rounded-xl p-6 border border-primary"
              aria-labelledby="lets-connect-heading"
            >
              <h3 id="lets-connect-heading" className="text-xl font-bold text-foreground mb-4">
                Let&apos;s Connect
              </h3>
              <p className="text-foreground/70 text-sm mb-4">Ready to experience the future of property management?</p>
              <Link
                href="/contact"
                className="inline-flex w-full items-center justify-center bg-primary hover:bg-primary text-foreground px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Schedule a Consultation
              </Link>
            </section>
          </div>
        </div>
      </div>

<div className="max-w-7xl mx-auto px-4 py-24">
  <div className="text-center mb-16">
    <h2
      id="ondo-journey-heading"
      className="text-4xl md:text-6xl font-bold text-foreground mb-6"
    >
      The <span className="text-primary">Ondo</span> Journey
    </h2>
    <p className="text-xl text-foreground/70 max-w-3xl mx-auto">
      From software engineering to real estate innovation - a decade of growth, learning, and building the future of property management.
    </p>
  </div>
  
  <div className="relative" aria-labelledby="ondo-journey-heading">
    {/* Timeline line */}
    <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>
    
    {/* Timeline items */}
    <div className="grid md:grid-cols-4 gap-8 md:gap-4">
      {/* 2013 */}
      <div className="group relative">
        <div className="flex flex-col items-center text-center">
          {/* Icon and year circle */}
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-background font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Code className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-background px-3 py-1 rounded-full text-sm font-bold">
              2013
            </div>
          </div>
          
          {/* Content card */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
            <h3 className="text-xl font-bold text-foreground mb-3">The Foundation</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Began journey in <strong className="text-primary">software engineering</strong> — mastering full stack development, 
              building scalable applications, and developing a deep understanding of technology's potential.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Full Stack</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Innovation</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2019 */}
      <div className="group relative">
        <div className="flex flex-col items-center text-center">
          {/* Icon and year circle */}
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-background font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Home className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-background px-3 py-1 rounded-full text-sm font-bold">
              2019
            </div>
          </div>
          
          {/* Content card */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
            <h3 className="text-xl font-bold text-foreground mb-3">The Spark</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Purchased <strong className="text-primary">first home in Utah</strong>. This life-changing experience sparked 
              a passion for real estate and began helping friends and family navigate their own property journeys.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">First Home</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Utah Market</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2022 */}
      <div className="group relative">
        <div className="flex flex-col items-center text-center">
          {/* Icon and year circle */}
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-background font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-background px-3 py-1 rounded-full text-sm font-bold">
              2022
            </div>
          </div>
          
          {/* Content card */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
            <h3 className="text-xl font-bold text-foreground mb-3">The Launch</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Founded <strong className="text-primary">Ondo Real Estate</strong> and launched <a href="https://ondosoft.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 font-semibold decoration-2 underline-offset-2 transition-colors">OndoSoft</a>. 
              Started building the platform that would merge cutting-edge technology with real estate expertise.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Ondo Launch</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Tech + RE</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2025 */}
      <div className="group relative">
        <div className="flex flex-col items-center text-center">
          {/* Icon and year circle */}
          <div className="relative mb-6">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-background font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Target className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-background px-3 py-1 rounded-full text-sm font-bold">
              2025+
            </div>
          </div>
          
          {/* Content card */}
          <div className="bg-card rounded-xl p-6 border border-border shadow-sm group-hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
            <h3 className="text-xl font-bold text-foreground mb-3">The Future</h3>
            <p className="text-foreground/70 text-sm leading-relaxed">
              Expanding Ondo into a <strong className="text-primary">fully integrated real estate ecosystem</strong> — 
              combining management, investment, and technology to serve owners and tenants with unprecedented innovation.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Ecosystem</span>
              <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">Innovation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
  
  {/* Bottom CTA */}
  <div className="bg-gradient-to-b from-background to-card py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">Ready to Experience Ondo?</h2>
          <p className="text-xl text-foreground mb-8 opacity-90">
            Join the revolution in property management. Whether you're an owner looking for smarter solutions or a tenant seeking a better
            experience, Ondo is here for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-background hover:bg-background/90 text-primary px-8 py-4 rounded-lg text-lg font-bold transition-colors text-center"
            >
              Start Your Journey
            </Link>
            <Link
              href="/about"
              className="bg-background hover:bg-background/90 text-primary px-8 py-4 rounded-lg text-lg font-bold transition-colors text-center"
            >
              Learn More About Ondo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
