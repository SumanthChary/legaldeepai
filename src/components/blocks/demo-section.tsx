import { DemoVideo } from "@/components/blocks/demo-video";
import { InView } from "@/components/ui/in-view";
export const DemoSection = () => {
  return <section className="py-16 lg:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <InView variants={{
        hidden: {
          opacity: 0,
          y: 20
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.6
      }} viewOptions={{
        once: true,
        margin: "-100px"
      }}>
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">See LegalDeep AI in Action!</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how our AI transforms lengthy contract reviews into quick, comprehensive analysis
            </p>
          </div>
        </InView>
        
        <InView variants={{
        hidden: {
          opacity: 0,
          y: 30
        },
        visible: {
          opacity: 1,
          y: 0
        }
      }} transition={{
        duration: 0.8,
        delay: 0.2
      }} viewOptions={{
        once: true,
        margin: "-100px"
      }}>
          <DemoVideo />
        </InView>
      </div>
    </section>;
};