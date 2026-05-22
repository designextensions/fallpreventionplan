import { useState } from "react";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  message: z.string().min(10, "Please enter a message (at least 10 characters)"),
});

export function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const onSubmit = (data: z.infer<typeof contactSchema>) => {
    // In a real app, send this to the server
    console.log("Contact form data:", data);
    setIsSubmitted(true);
  };

  return (
    <div className="flex-1 bg-background py-12 md:py-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-16 animate-in slide-in-from-bottom-4 duration-700">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary mb-6">
            Get in touch
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            We are here to answer any questions you have about the Fall Prevention Plan, our coaching services, or how we can help your family.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1 space-y-8">
            <div>
              <h3 className="font-serif text-2xl font-bold mb-6">Contact Info</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Email</p>
                    <p className="text-muted-foreground text-lg">support@fallpreventionplan.com</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Phone</p>
                    <p className="text-muted-foreground text-lg">(555) 123-4567</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Office</p>
                    <p className="text-muted-foreground text-lg">Active for Life Rehab<br/>123 Health Way<br/>Wellness City, USA</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <Card className="border-border shadow-lg">
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
                    <h3 className="font-serif text-3xl font-bold mb-4">Message Sent</h3>
                    <p className="text-lg text-muted-foreground mb-8">
                      Thank you for reaching out. We will get back to you as soon as possible, usually within 1 business day.
                    </p>
                    <Button 
                      onClick={() => setIsSubmitted(false)}
                      variant="outline" 
                      className="min-h-[48px] rounded-full px-8 text-lg"
                    >
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg">Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Jane Doe" className="min-h-[48px] text-lg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg">Email Address</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder="jane@example.com" className="min-h-[48px] text-lg" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg">Phone Number (Optional)</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="(555) 123-4567" className="min-h-[48px] text-lg" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-lg">How can we help?</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="I'm interested in the concierge plan for my mother..." 
                                className="min-h-[120px] text-lg resize-y" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button type="submit" className="w-full min-h-[56px] text-lg font-bold rounded-full">
                        Send Message
                      </Button>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
