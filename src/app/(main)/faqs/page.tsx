'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

export default function FAQsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQs, setExpandedFAQs] = useState<number[]>([]);

  const categories = [
    { id: 'all', name: 'All FAQs' },
    { id: 'ordering', name: 'Ordering' },
    { id: 'delivery', name: 'Delivery' },
    { id: 'products', name: 'Products' },
    { id: 'payment', name: 'Payment' },
    { id: 'returns', name: 'Returns & Refunds' },
    { id: 'account', name: 'Account' },
  ];

  const faqs: FAQ[] = [
    {
      question: 'How do I place an order?',
      answer: 'You can place an order by browsing our website, selecting the products you want, and proceeding to checkout. You\'ll need to provide delivery details and payment information to complete your order.',
      category: 'ordering'
    },
    {
      question: 'Can I modify my order after it\'s been placed?',
      answer: 'Yes, you can modify your order within 1 hour of placing it. Please contact our customer service team with your order number to make any changes.',
      category: 'ordering'
    },
    {
      question: 'What are your delivery hours?',
      answer: 'We deliver from 9 AM to 8 PM, seven days a week. For midnight deliveries, orders must be placed at least 6 hours in advance.',
      category: 'delivery'
    },
    {
      question: 'Do you offer same-day delivery?',
      answer: 'Yes, we offer same-day delivery for orders placed before 2 PM. Additional charges may apply for express delivery.',
      category: 'delivery'
    },
    {
      question: 'What areas do you deliver to?',
      answer: 'We deliver to most major cities across India. You can check if we deliver to your area by entering your pincode on our website.',
      category: 'delivery'
    },
    {
      question: 'How fresh are your flowers?',
      answer: 'Our flowers are sourced fresh daily from local and international farms. We ensure that only the freshest flowers are used in our arrangements.',
      category: 'products'
    },
    {
      question: 'Are your cakes eggless?',
      answer: 'We offer both egg and eggless cake options. You can select your preference when ordering.',
      category: 'products'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, UPI, net banking, and cash on delivery for most orders.',
      category: 'payment'
    },
    {
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption to protect your payment information. We do not store your credit card details on our servers.',
      category: 'payment'
    },
    {
      question: 'What is your return policy?',
      answer: 'Due to the perishable nature of our products, we do not accept returns. However, if you\'re not satisfied with the quality of the product, please contact us within 24 hours of delivery.',
      category: 'returns'
    },
    {
      question: 'How do I request a refund?',
      answer: 'If you\'re eligible for a refund, you can request it by contacting our customer service team with your order details. Refunds are typically processed within 5-7 business days.',
      category: 'returns'
    },
    {
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking on the "Sign Up" button on our website and filling in your details. You can also create an account during the checkout process.',
      category: 'account'
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order by logging into your account and viewing your order history. Alternatively, you can use the "Track Order" feature on our website with your order number and email address.',
      category: 'account'
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQs(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index) 
        : [...prev, index]
    );
  };

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to common questions about our products, services, and policies.
            </p>
            <div className="relative max-w-xl mx-auto">
              <Input
                type="text"
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Categories */}
            <div className="md:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Categories</h2>
                <nav className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      className={`block w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-pink-100 text-pink-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
            
            {/* FAQs */}
            <div className="md:w-3/4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {categories.find(c => c.id === activeCategory)?.name || 'All FAQs'}
                </h2>
                
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No FAQs found matching your search criteria.</p>
                    <Button 
                      variant="outline" 
                      className="border-pink-600 text-pink-600 hover:bg-pink-50"
                      onClick={() => {
                        setSearchQuery('');
                        setActiveCategory('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <div 
                        key={index} 
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <button
                          className="flex justify-between items-center w-full p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                          onClick={() => toggleFAQ(index)}
                        >
                          <h3 className="text-lg font-medium text-gray-800">{faq.question}</h3>
                          <ChevronDown 
                            className={`h-5 w-5 text-gray-500 transition-transform ${
                              expandedFAQs.includes(index) ? 'transform rotate-180' : ''
                            }`} 
                          />
                        </button>
                        {expandedFAQs.includes(index) && (
                          <div className="p-4 bg-white">
                            <p className="text-gray-600">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Still Have Questions?</h2>
            <p className="text-lg text-gray-600 mb-8">
              If you couldn't find the answer to your question, our customer support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/contact-us">Contact Us</Link>
              </Button>
              <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                <a href="tel:+911234567890">Call Us: +91 1234 567 890</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
