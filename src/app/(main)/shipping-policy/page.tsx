import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Shipping Policy | MISPRI',
  description: 'Learn about MISPRI\'s shipping policies, delivery timeframes, and shipping fees.',
};

export default function ShippingPolicyPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Shipping Policy</h1>
            <p className="text-lg text-gray-600">
              Everything you need to know about our shipping and delivery processes.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <h2>Delivery Areas</h2>
              <p>
                MISPRI currently delivers to most major cities across India. You can check if we deliver to your area by entering your pincode on the product page or during checkout.
              </p>

              <h2>Delivery Timeframes</h2>
              <p>
                We offer the following delivery options:
              </p>
              <ul>
                <li>
                  <strong>Standard Delivery:</strong> Orders are typically delivered within 1-2 business days from the date of order confirmation.
                </li>
                <li>
                  <strong>Same Day Delivery:</strong> Available for orders placed before 2 PM. Additional charges may apply.
                </li>
                <li>
                  <strong>Fixed Time Delivery:</strong> You can select a specific time slot for delivery. Additional charges may apply.
                </li>
                <li>
                  <strong>Midnight Delivery:</strong> Available for delivery between 11 PM and 12 AM. Orders must be placed at least 6 hours in advance. Additional charges may apply.
                </li>
              </ul>

              <h2>Shipping Fees</h2>
              <p>
                Shipping fees are calculated based on the delivery location, delivery type, and order value:
              </p>
              <ul>
                <li>
                  <strong>Free Shipping:</strong> Orders above ₹499 qualify for free standard delivery within city limits.
                </li>
                <li>
                  <strong>Standard Delivery Fee:</strong> ₹49 - ₹99 depending on the delivery location.
                </li>
                <li>
                  <strong>Same Day Delivery Fee:</strong> Additional ₹99 over the standard delivery fee.
                </li>
                <li>
                  <strong>Fixed Time Delivery Fee:</strong> Additional ₹149 over the standard delivery fee.
                </li>
                <li>
                  <strong>Midnight Delivery Fee:</strong> Additional ₹199 over the standard delivery fee.
                </li>
              </ul>

              <h2>Order Tracking</h2>
              <p>
                Once your order is confirmed, you will receive an order confirmation email with a tracking link. You can also track your order by:
              </p>
              <ul>
                <li>Logging into your account and viewing your order history</li>
                <li>Using the "Track Order" feature on our website with your order number and email address</li>
                <li>Contacting our customer service team</li>
              </ul>

              <h2>Delivery Confirmation</h2>
              <p>
                Upon successful delivery, we may request a signature from the recipient. In case the recipient is not available, we may:
              </p>
              <ul>
                <li>Leave the package with a neighbor or security guard (if permitted by you during checkout)</li>
                <li>Attempt delivery again later</li>
                <li>Contact you for alternative delivery instructions</li>
              </ul>

              <h2>Failed Delivery Attempts</h2>
              <p>
                If we are unable to deliver your order due to incorrect address information, recipient unavailability, or other reasons beyond our control:
              </p>
              <ul>
                <li>We will make up to 2 delivery attempts</li>
                <li>After failed attempts, we will contact you for further instructions</li>
                <li>Additional delivery charges may apply for rescheduled deliveries</li>
              </ul>

              <h2>International Shipping</h2>
              <p>
                We currently offer international shipping to select countries. International shipping rates and delivery timeframes vary by destination. Please contact our customer service team for more information about international shipping options.
              </p>

              <h2>Shipping Restrictions</h2>
              <p>
                Some products may have shipping restrictions due to their perishable nature or local regulations. These restrictions will be clearly indicated on the product page.
              </p>

              <h2>Policy Updates</h2>
              <p>
                We reserve the right to modify this shipping policy at any time. Changes will be effective immediately upon posting to our website. It is your responsibility to review this shipping policy periodically.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our shipping policy, please contact our customer service team:
              </p>
              <ul>
                <li>Email: support@mispri.com</li>
                <li>Phone: +91 1234 567 890</li>
                <li>Hours: Monday - Saturday, 9 AM - 8 PM</li>
              </ul>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-200">
              <p className="text-gray-600 mb-4">
                Last updated: June 1, 2023
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <Link href="/contact-us">Contact Us</Link>
                </Button>
                <Button asChild variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50">
                  <Link href="/faqs">View FAQs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
