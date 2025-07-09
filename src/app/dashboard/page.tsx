"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Zap } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

const UsageResetAPIButton = () => {
    const { toast } = useToast();
    const handleReset = async () => {
        // This is a mock API call.
        toast({
            title: "API Called",
            description: "Usage reset API has been triggered successfully for free users.",
        });
    }
    return (
        <Button onClick={handleReset} variant="outline" size="sm">
            Trigger Usage Reset API
        </Button>
    )
}

export default function DashboardPage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
                <p>Loading...</p>
            </div>
        );
    }
    
    const usagePercentage = user.plan.id === 'free' || user.plan.id === 'pro' ? (user.usage.requests / user.usage.maxRequests) * 100 : 0;

    return (
        <div className="container py-12">
            <h1 className="text-3xl font-bold tracking-tighter mb-2 font-headline">
                Welcome back, {user.name}!
            </h1>
            <p className="text-muted-foreground mb-8">Here's an overview of your account.</p>

            {user.plan.id === 'free' && (
                 <Alert className="mb-8 border-primary">
                    <Zap className="h-4 w-4" />
                    <AlertTitle>You are on the Free Plan!</AlertTitle>
                    <AlertDescription>
                        <div className="flex justify-between items-center">
                            <span>Upgrade to Pro to unlock more features and increase your limits.</span>
                            <Button asChild>
                                <Link href="/pricing">Upgrade</Link>
                            </Button>
                        </div>
                    </AlertDescription>
                </Alert>
            )}

            <div className="grid gap-8 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription>Your current plan and billing details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                           <div className="flex justify-between">
                                <span className="font-semibold">Current Plan:</span>
                                <span>{user.plan.name}</span>
                           </div>
                           <div className="flex justify-between">
                                <span className="font-semibold">Price:</span>
                                <span>{user.plan.price}{user.plan.id === 'pro' ? '/month' : ''}</span>
                           </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <Link href="/pricing" className="text-sm text-primary hover:underline">Change Plan</Link>
                        {user.plan.id !== 'free' && (
                            <Button variant="outline">Manage Billing</Button>
                        )}
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Usage This Month</CardTitle>
                        <CardDescription>Your request usage for the current billing period.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {user.plan.quota === Infinity ? (
                             <p className="text-center font-semibold text-2xl">Unlimited Usage</p>
                        ) : (
                            <>
                                <Progress value={usagePercentage} className="mb-2" />
                                <div className="text-center text-sm text-muted-foreground">
                                    {user.usage.requests} / {user.usage.maxRequests} requests used
                                </div>
                            </>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">Resets monthly.</p>
                        <UsageResetAPIButton />
                    </CardFooter>
                </Card>
            </div>
            
            <div className="mt-8 flex justify-center">
                <Button variant="destructive" onClick={logout}>Log Out</Button>
            </div>
        </div>
    );
}
