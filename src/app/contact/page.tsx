'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  message: z.string().min(10, 'Message must be at least 10 characters long.'),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isPending, setIsPending] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (values: FormData) => {
    setIsPending(true);
    // Simulate sending a message
    setTimeout(() => {
        console.log(values);
        toast({
            title: 'Message Sent!',
            description: 'Thanks for reaching out. We will get back to you shortly.',
        });
        setIsPending(false);
        setIsSubmitted(true);
        form.reset();
    }, 1500);
  };
  
  if (isSubmitted) {
    return (
        <div className="max-w-2xl mx-auto">
            <Card>
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center justify-center text-center p-12 gap-4">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <h2 className="text-2xl font-bold font-headline">Message Sent Successfully!</h2>
                        <p className="text-muted-foreground">We have received your message and will be in touch with you soon.</p>
                        <Button onClick={() => setIsSubmitted(false)}>Send Another Message</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Contact Us</CardTitle>
          <CardDescription>
            Have a question or feedback? Fill out the form below to get in touch with our team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
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
                    <FormLabel>Your Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
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
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea placeholder="How can we help you?" {...field} rows={6} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Send Message
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
