import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Return Policy | MISPRI',
  description: 'Learn about MISPRI\'s return and refund policies for flowers, cakes, and gifts.',
};

export default function ReturnPolicyPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Return Policy</h1>
            <p className="text-lg text-gray-600">
              Our policies regarding returns, replacements, and refunds.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <h2>Return Policy Overview</h2>
              <p>
                At MISPRI, we are committed to delivering high-quality products that meet your expectations. Due to the perishable nature of many of our products, our return policy is designed to address quality concerns while considering the unique characteristics of flowers, cakes, and other perishable items.
              </p>

              <h2>Quality Guarantee</h2>
              <p>
                We stand behind the quality of our products. If you are not completely satisfied with the quality of your purchase, please contact us within the specified timeframe for each product category:
              </p>
              <ul>
                <li>
                  <strong>Flowers and Plants:</strong> Within 24 hours of delivery
                </li>
                <li>
                  <strong>Cakes and Bakery Items:</strong> Within 2 hours of delivery
                </li>
                <li>
                  <strong>Non-perishable Gifts:</strong> Within 7 days of delivery
                </li>
              </ul>

              <h2>Return Eligibility</h2>
              <p>
                Due to the perishable nature of our products, we do not accept physical returns for:
              </p>
              <ul>
                <li>Flowers and floral arrangements</li>
                <li>Cakes and bakery items</li>
                <li>Food items and chocolates</li>
                <li>Personalized or custom-made items</li>
              </ul>
              <p>
                For non-perishable gifts that are not personalized, returns may be accepted under the following conditions:
              </p>
              <ul>
                <li>The item is in its original, unused condition</li>
                <li>The item is in its original packaging</li>
                <li>You have the original receipt or proof of purchase</li>
                <li>The return is initiated within 7 days of delivery</li>
              </ul>

              <h2>Quality Issues and Replacements</h2>
              <p>
                If you receive a product that is damaged, defective, or not as described, we offer the following remedies:
              </p>
              <ul>
                <li>
                  <strong>Replacement:</strong> We will replace the product with the same or similar item, subject to availability.
                </li>
                <li>
                  <strong>Store Credit:</strong> We may issue store credit for the value of the product, which can be used for future purchases.
                </li>
                <li>
                  <strong>Refund:</strong> In certain cases, we may issue a refund to the original payment method.
                </li>
              </ul>

              <h2>How to Report Quality Issues</h2>
              <p>
                To report quality issues with your order:
              </p>
              <ol>
                <li>
                  Contact our customer service team within the specified timeframe for your product category.
                </li>
                <li>
                  Provide your order number, details of the issue, and photos of the product (if possible).
                </li>
                <li>
                  Our customer service team will review your request and determine the appropriate resolution.
                </li>
              </ol>

              <h2>Non-Delivery or Incorrect Delivery</h2>
              <p>
                In case of non-delivery or incorrect delivery:
              </p>
              <ul>
                <li>
                  <strong>Non-Delivery:</strong> If your order was not delivered as scheduled, please contact us within 24 hours of the scheduled delivery time. We will either reschedule the delivery or issue a full refund.
                </li>
                <li>
                  <strong>Incorrect Delivery:</strong> If you received an incorrect product, please contact us within 24 hours of delivery. We will arrange for the correct product to be delivered and, if necessary, collect the incorrect item.
                </li>
              </ul>

              <h2>Refund Process</h2>
              <p>
                If a refund is approved, it will be processed as follows:
              </p>
              <ul>
                <li>
                  <strong>Credit/Debit Card Payments:</strong> Refunds will be initiated within 24-48 hours of approval. The amount may take 5-7 business days to reflect in your account, depending on your bank's policies.
                </li>
                <li>
                  <strong>UPI/Net Banking:</strong> Refunds will be initiated within 24-48 hours and may take 3-5 business days to reflect in your account.
                </li>
                <li>
                  <strong>Wallet Payments:</strong> Refunds to wallets are typically processed within 24 hours.
                </li>
                <li>
                  <strong>Cash on Delivery:</strong> Refunds for Cash on Delivery orders will be processed via bank transfer. You will need to provide your bank account details.
                </li>
              </ul>

              <h2>Return Shipping for Non-Perishable Items</h2>
              <p>
                For eligible non-perishable items that can be returned:
              </p>
              <ul>
                <li>
                  <strong>Return Shipping Cost:</strong> If the return is due to a quality issue or our error, we will cover the return shipping cost. If the return is for any other reason, the customer is responsible for the return shipping cost.
                </li>
                <li>
                  <strong>Return Process:</strong> Our customer service team will provide you with return instructions, including the return address and any return authorization number required.
                </li>
              </ul>

              <h2>Exceptions</h2>
              <p>
                The following exceptions apply to our return policy:
              </p>
              <ul>
                <li>
                  <strong>Seasonal and Sale Items:</strong> Seasonal items and products purchased during sales may have modified return policies, which will be clearly indicated at the time of purchase.
                </li>
                <li>
                  <strong>Gift Orders:</strong> For orders placed as gifts, refunds will be issued to the original purchaser, not the recipient.
                </li>
              </ul>

              <h2>Policy Updates</h2>
              <p>
                We reserve the right to modify this return policy at any time. Changes will be effective immediately upon posting to our website. It is your responsibility to review this return policy periodically.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about our return policy, please contact our customer service team:
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
