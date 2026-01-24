import Hero from '@/components/landing/Hero'
import DealsSection from '@/components/landing/DealsSection'
import HowItWorks from '@/components/landing/HowItWorks'
import PricingSection from '@/components/landing/PricingSection'
import FAQ from '@/components/landing/FAQ'
import AnimatedBackground from '@/components/landing/AnimatedBackground'

export default function Home() {
  return (
    <>
      <AnimatedBackground />
      <Hero />
      <HowItWorks />
      <DealsSection />
      <PricingSection />
      <FAQ />
    </>
  )
}
