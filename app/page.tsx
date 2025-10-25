'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Sparkles, Shield, Zap, Users, Globe } from 'lucide-react';
import { Navigation, Container } from '@/components/layout';
import { Button } from '@/components/ui';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <Navigation />

      <main className="relative">
        {/* Hero Section */}
        <section className="pt-32 sm:pt-36 md:pt-44 lg:pt-48 pb-20">
          <Container className="text-center space-y-6">
            <h1 className="text-[48px] sm:text-[80px] md:text-[120px] lg:text-[168px] leading-[0.85] font-semibold tracking-tight max-w-[12ch] mx-auto">
              TABSY<span className="align-super text-[0.3em] font-medium ml-1">™</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-neutral-600 tracking-tight mt-5 sm:mt-6 max-w-2xl mx-auto">
              The onchain workspace where teams collaborate transparently and payments execute instantly through smart contracts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <div className="relative inline-block group">
                <Button
                  variant="primary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => router.push('/dashboard')}
                >
                  Get Started
                </Button>
                <span
                  className="pointer-events-none absolute -bottom-3 left-1/2 z-0 h-6 w-44 -translate-x-1/2 rounded-full opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100"
                  style={{
                    background: 'radial-gradient(60% 100% at 50% 50%, rgba(255,255,255,.55), rgba(255,255,255,.28) 35%, transparent 70%)',
                    filter: 'blur(10px) saturate(120%)'
                  }}
                  aria-hidden="true"
                />
              </div>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  const featuresSection = document.getElementById('features');
                  featuresSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Learn More
              </Button>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-neutral-50">
          <Container>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                  100%
                </div>
                <div className="text-sm text-neutral-600 tracking-tight">
                  Trustless Payments
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                  Instant
                </div>
                <div className="text-sm text-neutral-600 tracking-tight">
                  Task Approval & Payment
                </div>
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-bold tracking-tight mb-2">
                  AI-Powered
                </div>
                <div className="text-sm text-neutral-600 tracking-tight">
                  Task Management
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
                Why Tabsy?
              </h2>
              <p className="text-lg text-neutral-600 tracking-tight max-w-2xl mx-auto">
                Built for teams who want transparency, speed, and trust in their collaboration workflow.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Feature 1 */}
              <div className="relative border-black border-8 bg-violet-100 rounded-[28px] overflow-hidden h-80 sm:h-96 flex flex-col">
                <div className="px-6 pt-6">
                  <span className="text-neutral-700 text-sm tracking-tight">( 001 )</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <Shield className="w-12 h-12 sm:w-14 sm:h-14 text-neutral-900" />
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-sm font-medium uppercase tracking-tight mb-2">Trustless Escrow</h3>
                  <p className="text-neutral-600 text-sm tracking-tight">
                    Smart contracts hold funds until work is verified and approved. No middlemen, no disputes.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="relative border-black border-8 bg-lime-100 rounded-[28px] overflow-hidden h-80 sm:h-96 flex flex-col">
                <div className="px-6 pt-6">
                  <span className="text-neutral-700 text-sm tracking-tight">( 002 )</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <Sparkles className="w-12 h-12 sm:w-14 sm:h-14 text-neutral-900" />
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-sm font-medium uppercase tracking-tight mb-2">AI-Powered Tasks</h3>
                  <p className="text-neutral-600 text-sm tracking-tight">
                    Create tasks using natural language. AI handles the details, you focus on building.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="relative border-black border-8 bg-rose-100 rounded-[28px] overflow-hidden h-80 sm:h-96 flex flex-col">
                <div className="px-6 pt-6">
                  <span className="text-neutral-700 text-sm tracking-tight">( 003 )</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <Zap className="w-12 h-12 sm:w-14 sm:h-14 text-neutral-900" />
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-sm font-medium uppercase tracking-tight mb-2">Instant Payments</h3>
                  <p className="text-neutral-600 text-sm tracking-tight">
                    Get paid immediately upon task approval. No delays, no payment processors, no fees.
                  </p>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="relative border-black border-8 bg-amber-100 rounded-[28px] overflow-hidden h-80 sm:h-96 flex flex-col">
                <div className="px-6 pt-6">
                  <span className="text-neutral-700 text-sm tracking-tight">( 004 )</span>
                </div>
                <div className="flex-1 flex items-center justify-center">
                  <Globe className="w-12 h-12 sm:w-14 sm:h-14 text-neutral-900" />
                </div>
                <div className="px-6 pb-6">
                  <h3 className="text-sm font-medium uppercase tracking-tight mb-2">Full Transparency</h3>
                  <p className="text-neutral-600 text-sm tracking-tight">
                    All actions recorded onchain. Verifiable and auditable by anyone, anytime.
                  </p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* How It Works */}
        <section className="py-24 bg-neutral-50">
          <Container>
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight mb-6">
                How It Works
              </h2>
              <p className="text-lg text-neutral-600 tracking-tight max-w-2xl mx-auto">
                Three simple steps to start collaborating onchain
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-violet-100 border-4 border-black rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">
                  Create Workspace
                </h3>
                <p className="text-neutral-600 tracking-tight">
                  Connect your wallet and create a workspace. Fund it with USDC for task bounties.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-lime-100 border-4 border-black rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">
                  Assign Tasks
                </h3>
                <p className="text-neutral-600 tracking-tight">
                  Use AI to create tasks or write them manually. Set bounties and assign to team members.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 bg-rose-100 border-4 border-black rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold tracking-tight mb-3">
                  Get Paid Instantly
                </h3>
                <p className="text-neutral-600 tracking-tight">
                  Complete work, submit deliverables, get approved. Payment releases automatically.
                </p>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-24 sm:py-32">
          <Container>
            <div className="relative border-black border-8 bg-gradient-to-br from-violet-100 to-lime-100 rounded-[28px] overflow-hidden p-12 sm:p-16 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight mb-6">
                Ready to Build Onchain?
              </h2>
              <p className="text-lg text-neutral-600 tracking-tight mb-8 max-w-2xl mx-auto">
                Join teams already collaborating transparently and getting paid instantly on Base.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  icon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => router.push('/dashboard')}
                >
                  Launch App
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => window.open('https://github.com', '_blank')}
                >
                  View on GitHub
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-neutral-200 py-8">
          <Container>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-neutral-600 tracking-tight">
                © 2024 Tabsy. Built on Base.
              </div>
              <div className="flex gap-6 text-sm text-neutral-600">
                <a href="#" className="hover:text-neutral-900 transition-colors tracking-tight">
                  Documentation
                </a>
                <a href="#" className="hover:text-neutral-900 transition-colors tracking-tight">
                  GitHub
                </a>
                <a href="#" className="hover:text-neutral-900 transition-colors tracking-tight">
                  Twitter
                </a>
              </div>
            </div>
          </Container>
        </footer>
      </main>
    </div>
  );
}
