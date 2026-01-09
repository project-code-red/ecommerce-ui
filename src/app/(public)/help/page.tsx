"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  ShoppingBag,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  User,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "How do I place an order?",
    answer:
      "To place an order, simply browse our products, add items to your cart, and proceed to checkout. You'll need to provide your shipping address and payment information to complete the order.",
    category: "ordering",
  },
  {
    id: "2",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express), debit cards, UPI, net banking, and cash on delivery (COD) for eligible orders.",
    category: "payment",
  },
  {
    id: "3",
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3-7 business days. Express shipping options are available at checkout for faster delivery (1-3 business days). Delivery times may vary based on your location.",
    category: "shipping",
  },
  {
    id: "4",
    question: "Can I return or exchange an item?",
    answer:
      "Yes, you can return or exchange items within 30 days of delivery. Items must be unused, in original packaging, and with tags attached. Please visit our Returns page for more details.",
    category: "returns",
  },
  {
    id: "5",
    question: "How do I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking number via email. You can use this number to track your order status in the 'My Orders' section of your account.",
    category: "tracking",
  },
  {
    id: "6",
    question: "Do you ship internationally?",
    answer:
      "Currently, we ship within India only. We're working on expanding our shipping to international destinations. Please check back for updates.",
    category: "shipping",
  },
  {
    id: "7",
    question: "How can I cancel my order?",
    answer:
      "You can cancel your order from the 'My Orders' section if it hasn't been shipped yet. Once shipped, you'll need to return the item after delivery.",
    category: "ordering",
  },
  {
    id: "8",
    question: "What is your refund policy?",
    answer:
      "Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be credited to your original payment method.",
    category: "returns",
  },
];

const helpCategories = [
  {
    icon: ShoppingBag,
    title: "Ordering",
    description: "Questions about placing and managing orders",
    link: "#ordering",
  },
  {
    icon: CreditCard,
    title: "Payment",
    description: "Payment methods and billing questions",
    link: "#payment",
  },
  {
    icon: Truck,
    title: "Shipping",
    description: "Delivery times and shipping options",
    link: "#shipping",
  },
  {
    icon: RotateCcw,
    title: "Returns",
    description: "Returns, exchanges, and refunds",
    link: "#returns",
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 rounded-full p-4">
              <HelpCircle className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
            How Can We Help You?
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions or contact our support team
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 sm:h-14 text-base"
            />
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {helpCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.title}
                href={category.link}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary/20"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 rounded-full p-3 mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            All Questions
          </button>
          {Array.from(new Set(faqs.map((f) => f.category))).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3 sm:space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <span className="font-semibold text-gray-900 text-sm sm:text-base pr-4">
                      {faq.question}
                    </span>
                    {openFaq === faq.id ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No results found for your search.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Contact Support Section */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-6 sm:p-8 md:p-12 text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Still Need Help?
          </h2>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Our support team is here to help you. Get in touch with us through any of these
            channels.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button variant="outline" className="w-full sm:w-auto">
                <Mail className="h-4 w-4 mr-2" />
                Email Us
              </Button>
            </Link>
            <Button variant="outline" className="w-full sm:w-auto">
              <Phone className="h-4 w-4 mr-2" />
              Call Us
            </Button>
            <Link href="/user/profile">
              <Button className="w-full sm:w-auto">
                <User className="h-4 w-4 mr-2" />
                My Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

