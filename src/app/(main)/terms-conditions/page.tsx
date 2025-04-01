import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Terms & Conditions | MISPRI',
  description: 'Read the terms and conditions for using MISPRI\'s website and services.',
};

export default function TermsConditionsPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Terms & Conditions</h1>
            <p className="text-lg text-gray-600">
              Please read these terms and conditions carefully before using our website and services.
            </p>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                Welcome to MISPRI ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your access to and use of the MISPRI website, mobile applications, and services (collectively, the "Services").
              </p>
              <p>
                By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.
              </p>

              <h2>2. Eligibility</h2>
              <p>
                You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into a binding agreement.
              </p>

              <h2>3. Account Registration</h2>
              <p>
                To access certain features of our Services, you may need to create an account. When you create an account, you agree to provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p>
                We reserve the right to suspend or terminate your account if we suspect any unauthorized access or use of your account or if you violate these Terms.
              </p>

              <h2>4. Use of Services</h2>
              <p>
                You agree to use our Services only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul>
                <li>Use our Services in any way that violates any applicable law or regulation</li>
                <li>Use our Services to engage in any conduct that restricts or inhibits anyone's use or enjoyment of the Services</li>
                <li>Use our Services to impersonate any person or entity or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
                <li>Attempt to gain unauthorized access to any portion of our Services or any other systems or networks connected to our Services</li>
                <li>Use any robot, spider, or other automatic device, process, or means to access our Services for any purpose</li>
                <li>Introduce any viruses, Trojan horses, worms, logic bombs, or other harmful material to our Services</li>
              </ul>

              <h2>5. Products and Services</h2>
              <p>
                We strive to provide accurate descriptions of our products and services. However, we do not warrant that product descriptions or other content on our Services are accurate, complete, reliable, current, or error-free.
              </p>
              <p>
                The availability of products and services is subject to change without notice. We reserve the right to limit quantities, discontinue products, or modify specifications at any time.
              </p>

              <h2>6. Orders and Payments</h2>
              <p>
                When you place an order through our Services, you are making an offer to purchase the products or services at the listed price. We reserve the right to accept or decline your order for any reason.
              </p>
              <p>
                You agree to provide current, complete, and accurate payment information for all purchases made through our Services. You authorize us to charge your payment method for all orders placed through our Services.
              </p>
              <p>
                All prices displayed on our Services are in Indian Rupees (INR) and are inclusive of applicable taxes unless otherwise stated.
              </p>

              <h2>7. Delivery</h2>
              <p>
                We will make reasonable efforts to deliver products within the estimated delivery timeframe. However, we do not guarantee delivery times, and delays may occur due to factors beyond our control.
              </p>
              <p>
                You are responsible for providing accurate delivery information. We are not liable for any delays or failures in delivery resulting from incorrect or incomplete delivery information.
              </p>

              <h2>8. Cancellations and Refunds</h2>
              <p>
                Our cancellation and refund policies are outlined in our <Link href="/cancellation-policy" className="text-pink-600 hover:underline">Cancellation Policy</Link> and <Link href="/return-policy" className="text-pink-600 hover:underline">Return Policy</Link>. By using our Services, you agree to be bound by these policies.
              </p>

              <h2>9. Intellectual Property</h2>
              <p>
                All content, features, and functionality of our Services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of MISPRI or our licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services without our prior written consent.
              </p>

              <h2>10. User Content</h2>
              <p>
                You may be able to submit content to our Services, such as reviews, comments, and feedback ("User Content"). By submitting User Content, you grant us a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such User Content throughout the world in any media.
              </p>
              <p>
                You represent and warrant that you own or control all rights in and to the User Content and that the User Content does not violate these Terms or any applicable law.
              </p>

              <h2>11. Privacy</h2>
              <p>
                Your privacy is important to us. Our <Link href="/privacy-policy" className="text-pink-600 hover:underline">Privacy Policy</Link> describes how we collect, use, and disclose information about you. By using our Services, you agree to our collection, use, and disclosure of information as described in our Privacy Policy.
              </p>

              <h2>12. Disclaimer of Warranties</h2>
              <p>
                OUR SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
              <p>
                WE DO NOT WARRANT THAT OUR SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT OUR SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
              </p>

              <h2>13. Limitation of Liability</h2>
              <p>
                TO THE FULLEST EXTENT PERMITTED BY LAW, IN NO EVENT WILL MISPRI, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, OUR SERVICES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.
              </p>

              <h2>14. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless MISPRI, its affiliates, and their respective officers, directors, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of our Services.
              </p>

              <h2>15. Governing Law and Jurisdiction</h2>
              <p>
                These Terms and your use of our Services are governed by and construed in accordance with the laws of India. Any legal suit, action, or proceeding arising out of or related to these Terms or our Services shall be instituted exclusively in the courts of India.
              </p>

              <h2>16. Changes to Terms</h2>
              <p>
                We may revise these Terms at any time by updating this page. Your continued use of our Services after any changes to these Terms constitutes your acceptance of the revised Terms.
              </p>

              <h2>17. Termination</h2>
              <p>
                We may terminate or suspend your access to our Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms.
              </p>

              <h2>18. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul>
                <li>Email: legal@mispri.com</li>
                <li>Phone: +91 1234 567 890</li>
                <li>Address: 123 Main Street, City, State, 12345, India</li>
              </ul>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Last updated: June 1, 2023
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <Link href="/privacy-policy">Privacy Policy</Link>
                </Button>
                <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <Link href="/contact-us">Contact Us</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
