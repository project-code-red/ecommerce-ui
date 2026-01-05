"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { useToast } from "@/components/ui/ToastProvider";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Invalid phone number").optional(),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactInput = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactInput) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    showToast("Thank you! We'll get back to you soon.", "success");
    reset();
    setIsSubmitting(false);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-gray-600 text-lg">
          We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Information */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Email</h3>
                <p className="text-gray-600">support@ecommerce.com</p>
                <p className="text-gray-600">info@ecommerce.com</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
                <p className="text-gray-600">+1 (555) 987-6543</p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Address</h3>
                <p className="text-gray-600">
                  123 Commerce Street
                  <br />
                  Business District
                  <br />
                  City, State 12345
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Business Hours</h3>
                <p className="text-gray-600">
                  Monday - Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 10:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <Card>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Name"
                  {...register("name")}
                  error={errors.name?.message}
                  placeholder="Your full name"
                />
                <Input
                  label="Email"
                  type="email"
                  {...register("email")}
                  error={errors.email?.message}
                  placeholder="your.email@example.com"
                />
              </div>
              <Input
                label="Phone (Optional)"
                type="tel"
                {...register("phone")}
                error={errors.phone?.message}
                placeholder="+1 (555) 123-4567"
              />
              <Input
                label="Subject"
                {...register("subject")}
                error={errors.subject?.message}
                placeholder="What is this regarding?"
              />
              <Textarea
                label="Message"
                rows={6}
                {...register("message")}
                error={errors.message?.message}
                placeholder="Tell us how we can help you..."
              />
              <Button type="submit" className="w-full" isLoading={isSubmitting}>
                Send Message
              </Button>
            </form>
          </Card>

          {/* FAQ Section */}
          <div className="mt-8">
            <Card>
              <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">How long does shipping take?</h3>
                  <p className="text-gray-600">
                    Standard shipping typically takes 3-5 business days. Express shipping options are available at checkout.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">What is your return policy?</h3>
                  <p className="text-gray-600">
                    We offer a 10-day return policy on most items. Items must be in original condition with tags attached.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Do you ship internationally?</h3>
                  <p className="text-gray-600">
                    Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">How can I track my order?</h3>
                  <p className="text-gray-600">
                    Once your order ships, you'll receive a tracking number via email. You can also track it from your account's order history.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

