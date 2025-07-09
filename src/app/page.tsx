import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LogIn, TrendingUp, Zap } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"


const features = [
  {
    icon: <LogIn className="h-8 w-8 text-primary" />,
    title: 'Secure Google Login',
    description: 'Leverage NextAuth for robust and secure Google authentication, right out of the box.',
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-primary" />,
    title: 'Stripe Billing',
    description: 'Integrated Stripe Checkout for seamless subscription management and payments.',
  },
  {
    icon: <Zap className="h-8 w-8 text-primary" />,
    title: 'Usage-Based Limiting',
    description: 'Control feature access with built-in usage limits for different subscription tiers.',
  },
];

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
        <div className="container px-4 md:px-6 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            The Next.js Boilerplate for SaaS
          </h1>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl my-6">
            BaseLeap is your production-ready starter kit, equipped with authentication, billing, and more. Built for Indian developers, ready for the world.
          </p>
          <Button asChild size="lg">
            <Link href="/pricing">Get Started Now</Link>
          </Button>
        </div>
      </section>

      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline">
            Everything You Need to Launch
          </h2>
          <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-center my-6">
            Focus on your product, not the boilerplate. We've handled the essentials.
          </p>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12 mt-12">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="items-center text-center">
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
              Ready to build your masterpiece?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Stop reinventing the wheel. Start with BaseLeap and ship your product faster.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
             <Button asChild size="lg">
                <Link href="/pricing">View Pricing</Link>
              </Button>
          </div>
        </div>
      </section>
      
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container max-w-4xl px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter text-center sm:text-4xl md:text-5xl font-headline mb-12">
                Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Is this really a production-ready template?</AccordionTrigger>
                <AccordionContent>
                  Yes. BaseLeap provides all the core functionalities like authentication and billing, allowing you to focus on your unique features. The underlying stack (Next.js, ShadCN, Stripe) is robust and scalable.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Can I customize the design?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. The UI is built with Tailwind CSS and ShadCN UI, making it incredibly easy to theme and customize. All colors, fonts, and components can be adapted to your brand.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>What do I need to do to set up billing?</AccordionTrigger>
                <AccordionContent>
                  You'll need to create a Stripe account, set up your products and prices in the Stripe Dashboard, and then add your Stripe API keys to your environment variables. The checkout flow and webhook handlers are already set up.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
        </div>
      </section>
    </div>
  );
}
