import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Cancellation Policy | MISPRI',
  description: 'Learn about MISPRI\'s order cancellation policies, procedures, and refund process.',
};

export default function CancellationPolicyPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Cancellation Policy</h1>
            <p className="text-lg text-gray-600">
              Our policies regarding order cancellations, modifications, and refunds.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <h2>Order Cancellation Timeframe</h2>
              <p>
                At MISPRI, we understand that circumstances may change after placing an order. Our cancellation policy is designed to be fair while considering the nature of our products and operational constraints:
              </p>
              <ul>
                <li>
                  <strong>Standard Orders:</strong> Orders can be cancelled up to 6 hours before the scheduled delivery time without any cancellation fee.
                </li>
                <li>
                  <strong>Same Day Delivery Orders:</strong> Orders can be cancelled within 1 hour of placing the order, provided the order has not entered the preparation phase.
                </li>
                <li>
                  <strong>Midnight Delivery Orders:</strong> Orders can be cancelled up to 12 hours before the scheduled delivery time.
                </li>
                <li>
                  <strong>Customized Products:</strong> Orders for customized products (such as personalized cakes or custom flower arrangements) can be cancelled up to 24 hours after placing the order, provided production has not begun.
                </li>
              </ul>

              <h2>How to Cancel an Order</h2>
              <p>
                You can cancel your order through any of the following methods:
              </p>
              <ul>
                <li>
                  <strong>Online:</strong> Log in to your account, go to your order history, select the order you wish to cancel, and click on the "Cancel Order" button (if the order is eligible for cancellation).
                </li>
                <li>
                  <strong>Phone:</strong> Call our customer service at +91 1234 567 890 during business hours (Monday - Saturday, 9 AM - 8 PM).
                </li>
                <li>
                  <strong>Email:</strong> Send an email to support@mispri.com with your order number and cancellation request.
                </li>
              </ul>

              <h2>Order Modifications</h2>
              <p>
                Order modifications are subject to similar timeframes as cancellations:
              </p>
              <ul>
                <li>
                  <strong>Delivery Date/Time:</strong> Can be modified up to 6 hours before the originally scheduled delivery time, subject to availability.
                </li>
                <li>
                  <strong>Delivery Address:</strong> Can be modified up to 6 hours before the scheduled delivery time, subject to the new address being within our delivery area.
                </li>
                <li>
                  <strong>Product Changes:</strong> Product changes or substitutions can be requested up to 6 hours before the scheduled delivery time, subject to product availability.
                </li>
              </ul>

              <h2>Refund Process</h2>
              <p>
                If your cancellation request is approved, refunds will be processed as follows:
              </p>
              <ul>
                <li>
                  <strong>Credit/Debit Card Payments:</strong> Refunds will be initiated within 24-48 hours of cancellation approval. The amount may take 5-7 business days to reflect in your account, depending on your bank's policies.
                </li>
                <li>
                  <strong>UPI/Net Banking:</strong> Refunds will be initiated within 24-48 hours and may take 3-5 business days to reflect in your account.
                </li>
                <li>
                  <strong>Wallet Payments:</strong> Refunds to wallets are typically processed within 24 hours.
                </li>
                <li>
                  <strong>Cash on Delivery:</strong> For orders placed with Cash on Delivery that have not been delivered, no refund is necessary as no payment has been made.
                </li>
              </ul>

              <h2>Cancellation Fees</h2>
              <p>
                Cancellation fees may apply in the following scenarios:
              </p>
              <ul>
                <li>
                  <strong>Late Cancellations:</strong> Orders cancelled less than 6 hours before the scheduled delivery time may incur a cancellation fee of 25% of the order value.
                </li>
                <li>
                  <strong>Orders in Preparation:</strong> Orders that have entered the preparation phase may incur a cancellation fee of 50% of the order value.
                </li>
                <li>
                  <strong>Orders in Transit:</strong> Orders that are already in transit cannot be cancelled and are not eligible for a refund.
                </li>
                <li>
                  <strong>Customized Products:</strong> Cancellation of customized products after production has begun may incur a cancellation fee of up to 100% of the order value, depending on the stage of production.
                </li>
              </ul>

              <h2>Non-Cancellable Orders</h2>
              <p>
                Certain orders may not be eligible for cancellation:
              </p>
              <ul>
                <li>Orders that have already been delivered</li>
                <li>Orders that are in transit</li>
                <li>Orders for highly perishable items where preparation has already begun</li>
                <li>Orders for customized products where production has been completed</li>
              </ul>

              <h2>Special Circumstances</h2>
              <p>
                We understand that special circumstances may arise. In case of emergencies or exceptional situations, please contact our customer service team as soon as possible, and we will do our best to accommodate your request.
              </p>

              <h2>Policy Updates</h2>
              <p>
                We reserve the right to modify this cancellation policy at any time. Changes will be effective immediately upon posting to our website. It is your responsibility to review this cancellation policy periodically.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our cancellation policy, please contact our customer service team:
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
