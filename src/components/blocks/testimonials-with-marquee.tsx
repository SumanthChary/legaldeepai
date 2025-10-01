
import { cn } from "@/lib/utils"
import { TestimonialCard, TestimonialAuthor } from "@/components/ui/testimonial-card"
import { InView } from "@/components/ui/in-view"
import { testimonials } from "@/data/testimonials"

interface TestimonialsSectionProps {
  title?: string
  description?: string
  testimonials?: Array<{
    author: TestimonialAuthor
    text: string
    href?: string
  }>
  className?: string
}

export function TestimonialsSection({ 
  title = "What Our Users Say",
  description = "Trusted feedback from legal professionals using our platform",
  testimonials: customTestimonials,
  className 
}: TestimonialsSectionProps) {
  const testimonialsToShow = customTestimonials || testimonials;
  return (
    <section className={cn(
      "bg-background text-foreground",
      "py-12 md:py-16 lg:py-24 px-0",
      className
    )}>
      <div className="mx-auto flex max-w-container flex-col items-center gap-6 md:gap-8 lg:gap-16 text-center">
        <InView
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex flex-col items-center gap-4 px-4 sm:gap-6 md:gap-8">
            <h2 className="max-w-[720px] text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-semibold leading-tight">
              {title}
            </h2>
            <p className="text-sm md:text-lg max-w-[600px] font-medium text-muted-foreground">
              {description}
            </p>
          </div>
        </InView>

        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <div className="group flex overflow-hidden p-2 [--gap:1rem] [gap:var(--gap)] flex-row [--duration:60s]">
            <div className="flex shrink-0 justify-around [gap:var(--gap)] animate-marquee flex-row">
              {[...Array(4)].map((_, setIndex) => (
                testimonialsToShow.map((testimonial, i) => (
                  <TestimonialCard 
                    key={`${setIndex}-${i}`}
                    {...testimonial}
                  />
                ))
              ))}
            </div>
          </div>

          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-1/3 bg-gradient-to-r from-background sm:block" />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 bg-gradient-to-l from-background sm:block" />
        </div>
      </div>
    </section>
  )
}
