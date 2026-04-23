import Hero from '@/components/Hero'
import Services from '@/components/Services'
import Benefits from '@/components/Benefits'
import Gallery from '@/components/Gallery'
import Testimonials from '@/components/Testimonials'
import CTA from '@/components/CTA'
import Contact from '@/components/Contact'
import { client } from '@/sanity/lib/client'
import { getPropertiesQuery, getReviewsQuery } from '@/sanity/lib/queries'

// Para asegurar que los datos estén frescos. En un SaaS real podríamos usar ISR (revalidate) o force-dynamic.
export const revalidate = 0

export default async function Home() {
  const [properties, reviews] = await Promise.all([
    client.fetch(getPropertiesQuery),
    client.fetch(getReviewsQuery)
  ])

  return (
    <>
      <Hero />
      <Services />
      <Benefits />
      <Gallery initialProperties={properties} />
      <Testimonials initialReviews={reviews} />
      <CTA />
      <Contact />
    </>
  )
}