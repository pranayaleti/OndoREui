import { Gift, Trophy, Sparkles, Star, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import SEO from "@/components/seo"
import { generateBreadcrumbJsonLd } from "@/lib/seo"
import { SITE_URL } from "@/lib/site"
import { SweepstakesContent } from "./sweepstakes-content"
import Image from "next/image"

export default function SweepstakesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="Apple Tech Giveaway Sweepstakes | Ondo Real Estate"
        description="Enter Ondo Real Estate's sweepstakes for a chance to win Apple products: MacBook, iPhone, and AirPods! Unlimited bonus entries available."
        pathname="/sweepstakes"
        image={`${SITE_URL}/modern-office-building.png`}
        jsonLd={generateBreadcrumbJsonLd([
          { name: "Home", url: SITE_URL },
          { name: "Sweepstakes", url: `${SITE_URL}/sweepstakes` },
        ])}
      />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-b from-background to-card text-white py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid gap-8 lg:grid-cols-2 items-center max-w-6xl mx-auto">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                Apple Tech Giveaway
              </h1>
              <p className="text-xl md:text-2xl mb-6 opacity-90">
                Win MacBook, iPhone & AirPods!
              </p>
              <div className="flex items-center gap-2 text-lg">
                <Gift className="h-5 w-5" />
                <span>Enter now for your chance to win</span>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card/75 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">💻</div>
                  <h3 className="font-bold text-sm">MacBook</h3>
                </div>
                <div className="bg-card/75 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">📱</div>
                  <h3 className="font-bold text-sm">iPhone</h3>
                </div>
                <div className="bg-card/75 backdrop-blur-sm rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">🎧</div>
                  <h3 className="font-bold text-sm">AirPods</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            
            {/* Contest Details */}
            <div className="max-w-4xl mx-auto mb-12">
              <Card className="border-2 border-primary">
                <CardHeader className="text-center">
                  <CardTitle className="text-3xl">Contest Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Trophy className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">Prize Info</h3>
                      <p className="text-sm text-foreground/70">3 Winners</p>
                      <div className="space-y-1 text-sm">
                        <p className="font-semibold text-primary">1st Prize: MacBook Pro</p>
                        <p className="font-semibold text-primary">2nd Prize: iPhone 17</p>
                        <p className="font-semibold text-primary">3rd Prize: AirPods Pro</p>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center justify-center mb-2">
                        <Gift className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-bold text-lg mb-1">How to Enter</h3>
                      <p className="text-sm text-foreground/70 mb-2">Enter anytime - no deadlines!</p>
                      <ul className="text-left space-y-1 text-sm">
                        <li>✓ Enter your email for your first free entry</li>
                        <li>✓ View and agree to our Official Rules</li>
                        <li>✓ Get access to unlimited bonus entries</li>
                        <li>✓ Winners announced soon!!</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Prize Showcase Section */}
            <div className="max-w-6xl mx-auto mb-12">
              <Card className="border-2 border-primary overflow-hidden">
                <div className="grid md:grid-cols-3 gap-6 p-6">
                  <div className="text-center bg-gradient-to-br from-background to-muted rounded-lg p-8">
                    <div className="text-6xl mb-4">💻</div>
                    <h3 className="text-xl font-bold mb-2">MacBook Pro</h3>
                    <p className="text-sm text-foreground/70">Latest model with M3 chip</p>
                    <p className="text-lg font-semibold text-primary mt-2">1st Prize</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-background to-muted rounded-lg p-8">
                    <div className="text-6xl mb-4">📱</div>
                    <h3 className="text-xl font-bold mb-2">iPhone 17</h3>
                    <p className="text-sm text-foreground/70">Latest iPhone with Pro features</p>
                    <p className="text-lg font-semibold text-primary mt-2">2nd Prize</p>
                  </div>
                  <div className="text-center bg-gradient-to-br from-background to-muted rounded-lg p-8">
                    <div className="text-6xl mb-4">🎧</div>
                    <h3 className="text-xl font-bold mb-2">AirPods Pro</h3>
                    <p className="text-sm text-foreground/70">Active noise cancellation</p>
                    <p className="text-lg font-semibold text-primary mt-2">3rd Prize</p>
                  </div>
                </div>
                <CardContent className="text-center p-6 bg-primary/5">
                  <h3 className="text-2xl font-bold mb-2">Win Apple's Latest Tech</h3>
                  <p className="text-foreground/70">
                    Three amazing prizes up for grabs! Enter now for your chance to win.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-12 lg:grid-cols-3">
              {/* Main Entry Form */}
              <div className="lg:col-span-2">
                <SweepstakesContent />

                {/* Terms and Conditions */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5 text-primary" />
                      Official Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 text-sm">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold mb-2">📋 Eligibility</p>
                      <p className="text-foreground/70">Must be 18 years or older and a legal resident of the United States.</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold mb-2">🎯 How to Enter</p>
                      <p className="text-foreground/70">Enter your email for your first free entry. Complete bonus actions to earn more entries.</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold mb-2">🏆 Prizes</p>
                      <p className="text-foreground/70">MacBook Pro, iPhone 17, AirPods Pro. Winners will be contacted via email.</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold mb-2">🎲 Drawing</p>
                      <p className="text-foreground/70">Winners will be selected randomly from all entries. Odds depend on number of entries. Winners will be announced soon!!</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="font-semibold mb-2">⚖️ Terms</p>
                      <p className="text-foreground/70">No purchase necessary. Void where prohibited. By entering, you agree to receive promotional emails from Ondo Real Estate.</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Bonus Entries */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-6 w-6 text-primary" />
                      <CardTitle>Unlimited Bonus Entries</CardTitle>
                    </div>
                    <CardDescription>Start by entering your email above to unlock bonus entries</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
                        <span className="font-medium">Share Referral Link</span>
                        <span className="text-primary font-bold">∞ Unlimited</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
                        <span className="font-medium">Follow on Facebook</span>
                        <span className="text-primary font-bold">+1 Entry</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
                        <span className="font-medium">Follow on Instagram</span>
                        <span className="text-primary font-bold">+1 Entry</span>
                      </div>
                      <div className="flex items-center justify-between p-2 bg-primary/5 rounded">
                        <span className="font-medium">Follow on LinkedIn</span>
                        <span className="text-primary font-bold">+1 Entry</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Entry Tips */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Star className="h-6 w-6 text-primary" />
                      <CardTitle>Past Winners</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <Image 
                        src="/professional-man-suit.png" 
                        alt="Winner" 
                        width={60} 
                        height={60} 
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">JOHN M.</h4>
                        <p className="text-foreground/70 text-xs">MacBook Pro Winner</p>
                        <p className="text-xs text-primary">Recent Winner</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 pb-3 border-b">
                      <Image 
                        src="/professional-woman-smiling.png" 
                        alt="Winner" 
                        width={60} 
                        height={60} 
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">SARAH K.</h4>
                        <p className="text-foreground/70 text-xs">iPhone 16 Winner</p>
                        <p className="text-xs text-primary">Recent Winner</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Image 
                        src="/professional-woman-glasses.png" 
                        alt="Winner" 
                        width={60} 
                        height={60} 
                        className="rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold">EMILY R.</h4>
                        <p className="text-foreground/70 text-xs">AirPods Pro Winner</p>
                        <p className="text-xs text-primary">Recent Winner</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Ondo Section */}
        <section className="bg-gradient-to-b from-muted/30 to-background py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-center">
                Why 1 Million+ Customers Choose Ondo Real Estate
              </h2>
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">⭐ 4.9/5</div>
                    <p className="text-sm text-foreground/70 mb-4">85,000+ Customer Reviews</p>
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <p className="text-sm">Excellent service! Perfect home, great customer support. Couldn't be happier with my experience!</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">🏆 Top Rated</div>
                    <p className="text-sm text-foreground/70 mb-4">Best in Property Management</p>
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <p className="text-sm">Professional team, responsive management. They truly care about their clients and properties.</p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">🎯 Trusted</div>
                    <p className="text-sm text-foreground/70 mb-4">Serving Utah Since 2010</p>
                    <div className="flex items-start gap-2">
                      <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                      <p className="text-sm">Fast, reliable, and trustworthy. Made the entire process smooth and stress-free!</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-b from-background to-card py-20">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Ready to Win Apple Tech?
              </h2>
              <p className="text-xl text-foreground mb-8 opacity-90">
                Join the Ondo community and enter for a chance to win MacBook, iPhone & AirPods. Share your referral code to increase your odds!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

