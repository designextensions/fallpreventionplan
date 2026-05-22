import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Stethoscope, Award, Heart } from "lucide-react";

export function About() {
  return (
    <div className="flex-1 bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            About the Program
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Built on 20 years of clinical physical therapy experience, the Fall Prevention Plan provides a clear, actionable path to maintaining independence.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="font-serif text-3xl font-bold">Our Philosophy</h2>
            <p className="text-lg text-foreground/80">
              Most fall prevention advice is fragmented. A doctor might suggest removing throw rugs, while a physical therapist prescribes exercises. 
            </p>
            <p className="text-lg text-foreground/80">
              We believe in a holistic approach. By combining physical conditioning, environmental modifications, and education into one structured plan, we give older adults the tools they need to stay safe and confident in their own homes.
            </p>
          </div>
          <div className="grid gap-6">
            <Card className="border-l-4 border-l-primary">
              <CardContent className="p-6">
                <Stethoscope className="w-8 h-8 text-primary mb-4" />
                <h3 className="font-serif font-bold text-xl mb-2">Clinically Proven</h3>
                <p className="text-muted-foreground">Based on CDC STEADI guidelines and decades of direct patient care.</p>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-accent">
              <CardContent className="p-6">
                <Heart className="w-8 h-8 text-accent mb-4" />
                <h3 className="font-serif font-bold text-xl mb-2">Compassionate Care</h3>
                <p className="text-muted-foreground">We understand the anxiety surrounding falls. Our approach is reassuring, never patronizing.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-8 md:p-12 border border-border shadow-lg mb-24">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden shrink-0 border-4 border-primary/10">
              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground font-serif text-4xl">
                GA
              </div>
            </div>
            <div>
              <h2 className="font-serif text-3xl font-bold mb-2">Meet Geoff Angell, DPT</h2>
              <p className="text-primary font-bold mb-4">Founder & Lead Physical Therapist</p>
              <p className="text-lg text-muted-foreground mb-6">
                With over two decades of experience running a mobile physical therapy practice, Geoff has seen firsthand how devastating falls can be—and more importantly, how preventable they are. He created this program to reach those who want proactive guidance before a crisis occurs.
              </p>
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                <Award className="w-5 h-5 text-primary" />
                <span>Doctor of Physical Therapy (DPT)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="font-serif text-3xl font-bold mb-6">Ready to get started?</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/assessment">
              <Button size="lg" className="min-h-[56px] text-lg rounded-full px-8">
                Take the Self-Assessment
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="min-h-[56px] text-lg rounded-full px-8">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
