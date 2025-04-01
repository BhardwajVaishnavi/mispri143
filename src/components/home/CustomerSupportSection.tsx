'use client';

import Link from 'next/link';
import { Phone, Mail, MessageCircle, Clock, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupportOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: React.ReactNode;
}

export default function CustomerSupportSection() {
  const supportOptions: SupportOption[] = [
    {
      icon: <Phone className="h-8 w-8 text-pink-600" />,
      title: 'Call Us',
      description: 'Speak directly with our customer support team',
      action: (
        <Button asChild className="bg-pink-600 hover:bg-pink-700 mt-2">
          <a href="tel:+911234567890">+91 1234 567 890</a>
        </Button>
      )
    },
    {
      icon: <Mail className="h-8 w-8 text-pink-600" />,
      title: 'Email Us',
      description: 'Send us your queries and we\'ll respond within 24 hours',
      action: (
        <Button asChild className="bg-pink-600 hover:bg-pink-700 mt-2">
          <a href="mailto:support@mispri.com">support@mispri.com</a>
        </Button>
      )
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-pink-600" />,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: (
        <Button className="bg-pink-600 hover:bg-pink-700 mt-2" onClick={() => alert('Live chat would open here')}>
          Start Chat
        </Button>
      )
    },
    {
      icon: <HelpCircle className="h-8 w-8 text-pink-600" />,
      title: 'FAQs',
      description: 'Find answers to commonly asked questions',
      action: (
        <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 mt-2">
          <Link href="/faqs">View FAQs</Link>
        </Button>
      )
    }
  ];

  return (
    <div className="bg-white py-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800">We're Here to Help</h2>
          <p className="text-gray-600 mt-2">Our customer support team is available to assist you</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 border border-gray-200 hover:border-pink-200 hover:shadow-md transition-all text-center"
            >
              <div className="inline-flex items-center justify-center bg-pink-50 rounded-full p-4 mb-4">
                {option.icon}
              </div>
              <h3 className="font-semibold text-xl text-gray-800 mb-2">{option.title}</h3>
              <p className="text-gray-600 mb-4">{option.description}</p>
              {option.action}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-pink-50 rounded-lg p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <Clock className="h-6 w-6 text-pink-600 mr-2" />
            <span className="font-medium text-gray-800">Support Hours: Monday to Saturday, 9 AM - 8 PM</span>
          </div>
          <p className="text-gray-600">
            We strive to respond to all inquiries within 2 hours during our support hours.
          </p>
        </div>
      </div>
    </div>
  );
}
