"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { PLANS } from "@/lib/constants";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function PricingPage() {
    const { user, login, subscribe } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const handleSubscribe = (planId: string) => {
        if (!user) {
            login();
            toast({
                title: "Logged In",
                description: "You've been logged in. Please select your plan again.",
            });
            return;
        }

        const plan = PLANS.find(p => p.id === planId);
        if (plan) {
            // In a real app, this would initiate a Stripe checkout session
            subscribe(plan);
            toast({
                title: "Subscription Updated!",
                description: `You are now on the ${plan.name} plan.`,
            });
            router.push('/dashboard');
        }
    };

  return (
    <div className="container py-12">
        <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Find the perfect plan</h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
                Start for free, and scale up as you grow. All plans include a 7-day trial.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {PLANS.map((plan) => (
                <Card key={plan.id} className={cn("flex flex-col", { "border-primary shadow-lg": plan.id === 'pro' })}>
                    {plan.id === 'pro' && (
                        <div className="bg-primary text-primary-foreground text-center py-1 text-sm font-semibold rounded-t-lg">Most Popular</div>
                    )}
                    <CardHeader>
                        <CardTitle>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                        <div className="flex items-baseline pt-4">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            {plan.id !== 'free' && plan.id !== 'enterprise' && <span className="text-muted-foreground">/month</span>}
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <ul className="space-y-4">
                            {plan.features.map((feature, index) => (
                                <li key={index} className="flex items-center">
                                    <Check className="h-5 w-5 text-green-500 mr-2" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => handleSubscribe(plan.id)}
                            variant={plan.id === 'pro' ? 'default' : 'outline'}
                            disabled={user?.plan.id === plan.id}
                        >
                            {user?.plan.id === plan.id ? "Current Plan" : "Get Started"}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    </div>
  );
}
