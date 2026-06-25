import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Shield, Activity, Users, UserRound } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 md:pt-32 md:pb-40 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-background/80 md:bg-background/40 z-10" />
          <img 
            src="/hero-seniors.png" 
            alt="Seniors walking confidently" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="container relative z-20 mx-auto px-4">
          <div className="max-w-2xl bg-background/95 backdrop-blur-sm p-8 md:p-12 rounded-2xl shadow-xl border border-border/50 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-6">
              <Shield className="mr-2 h-4 w-4" /> Trusted by families for 20+ years
            </div>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground mb-6">
              Stay steady. <br />Stay independent.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              A comprehensive, physical therapist-designed plan to help older adults reduce fall risk, build strength, and maintain their freedom at home.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/assessment">
                <Button size="lg" className="w-full sm:w-auto min-h-[56px] text-lg rounded-full px-8 shadow-md hover:shadow-lg transition-all">
                  Take Free Self-Assessment
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-h-[56px] text-lg rounded-full px-8 border-primary/20 hover:bg-primary/5">
                  View Plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Preface — a welcome from the author (Dr. Angell's verbatim preface) */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-start gap-12 max-w-6xl mx-auto">
            <div className="w-full lg:w-1/3 flex flex-col items-center text-center">
              {/* Author photo slot — Dr. Angell asks for a picture of the author to
                  build attachment and trust. Replace with a real photo when available. */}
              <div className="w-48 h-48 rounded-full border-2 border-dashed border-primary/30 bg-primary/5 flex flex-col items-center justify-center mb-4">
                <UserRound className="w-14 h-14 text-primary/40" />
                <span className="text-xs text-muted-foreground mt-2 px-4">
                  Photo of Dr. Geoff Angell, DPT
                </span>
              </div>
              <p className="font-serif text-xl font-bold">Dr. Geoff Angell, DPT</p>
              <p className="text-muted-foreground">Physical Therapist · Author</p>
            </div>

            <div className="w-full lg:w-2/3 space-y-5">
              <h2 className="font-serif text-3xl md:text-4xl font-bold">A welcome from the author</h2>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Welcome to the Fall Prevention Plan, a comprehensive guide for decreasing the risk of
                falls. I am Dr. Geoff Angell, DPT, the author and a physical therapist with over 20
                years experience in geriatric balance, mobility, and safety, helping seniors live at
                their highest level of independence.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Falls are a major concern for seniors, affecting roughly one in every four people over
                the age of 65, and often leading to significant life changes. Falls, however, don't
                have to be such a big problem. Effective and easy-to-implement strategies exist that
                can significantly reduce their rate of occurrence. Unfortunately, until now, there
                hasn't been a resource that laid out an all-encompassing plan to stop falls and then
                took the time to thoroughly explain how to implement each step. There is an abundance
                of material that focuses on discrete fall prevention methods, but nothing that
                addresses the subject as a whole.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                It was for this reason that I created The Fall Prevention Plan. It is an easy to follow,
                effective, and complete strategy to stop falls that blends proven fall prevention
                techniques with the clinical experience of a physical therapist who has provided over
                10,000 successful balance and fall prevention treatments.
              </p>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Following the strategies presented in The Fall Prevention Plan can have a profound
                effect on the lives of all who read it. It can provide the knowledge, confidence,
                safety and steadiness needed to live life to the fullest and it is my sincere hope that
                it will help you too!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Who it's for */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Is this plan right for you or a loved one?</h2>
            <p className="text-lg text-muted-foreground">
              We built this program specifically for older adults and their adult children who want proactive, proven strategies.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-none shadow-md bg-background">
              <CardContent className="pt-8 px-6 pb-8 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                  <Activity className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-4">Recent Fall Scare</h3>
                <p className="text-muted-foreground">
                  If you or a parent recently had a close call, this plan provides immediate, actionable steps to prevent the next one.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md bg-background">
              <CardContent className="pt-8 px-6 pb-8 text-center">
                <div className="mx-auto w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-4">Loss of Confidence</h3>
                <p className="text-muted-foreground">
                  Fear of falling often leads to reduced activity. We help rebuild confidence through guided, safe progression.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-background">
              <CardContent className="pt-8 px-6 pb-8 text-center">
                <div className="mx-auto w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-serif text-xl font-bold mb-4">Adult Children</h3>
                <p className="text-muted-foreground">
                  Get peace of mind knowing your parent has a structured, expert-led plan to keep their home safe.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* The 10-Point Plan Overview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 max-w-6xl mx-auto">
            <div className="w-full lg:w-1/2">
              <img 
                src="/clinician-exercise.png" 
                alt="Clinician demonstrating balance exercise" 
                className="w-full rounded-2xl shadow-xl border border-border/50"
              />
            </div>
            <div className="w-full lg:w-1/2 space-y-8">
              <div>
                <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
                  Creating a Personalized Fall Prevention Plan
                </h2>
                <p className="text-lg text-muted-foreground">
                  The core of the program walks you through the 10 most common areas related to falls
                  and the best strategies known to prevent them.
                </p>
              </div>

              <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4">
                {[
                  "Mindset",
                  "Footwear",
                  "Vision",
                  "Medication",
                  "Nutrition and Hydration",
                  "Posture",
                  "Home Safety",
                  "Assistive Device Selection",
                  "Strength",
                  "Balance",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary">{i + 1}</span>
                    </div>
                    <span className="text-lg font-medium">{item}</span>
                  </li>
                ))}
              </ul>

              <Link href="/about">
                <Button variant="outline" className="min-h-[48px] rounded-full px-6">
                  Learn more about the program
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">
              Ready to take the first step?
            </h2>
            <p className="text-xl text-primary-foreground/80 leading-relaxed">
              Start with our free Fall Self-Assessment. We'll guide you through the Timed Up and Go test and a short risk-factor checklist, then give you a personalized risk profile and recommendations instantly.
            </p>
            <div className="pt-4">
              <Link href="/assessment">
                <Button size="lg" variant="secondary" className="min-h-[56px] text-lg rounded-full px-10 shadow-lg text-primary font-bold">
                  Start Free Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
