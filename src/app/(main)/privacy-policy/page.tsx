import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Privacy Policy | MISPRI',
  description: 'Learn how MISPRI collects, uses, and protects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Privacy Policy</h1>
            <p className="text-lg text-gray-600">
              How we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </section>

      {/* Policy Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
            <div className="prose max-w-none">
              <h2>1. Introduction</h2>
              <p>
                At MISPRI ("we," "our," or "us"), we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, or use our services (collectively, the "Services").
              </p>
              <p>
                Please read this Privacy Policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with our policies and practices, please do not use our Services.
              </p>

              <h2>2. Information We Collect</h2>
              <p>
                We collect several types of information from and about users of our Services, including:
              </p>
              <h3>2.1 Personal Information</h3>
              <p>
                Personal information is information that identifies you as an individual. We may collect the following personal information:
              </p>
              <ul>
                <li>Name</li>
                <li>Email address</li>
                <li>Phone number</li>
                <li>Postal address</li>
                <li>Payment information (credit card number, bank account details, etc.)</li>
                <li>Date of birth</li>
                <li>Gender</li>
              </ul>

              <h3>2.2 Non-Personal Information</h3>
              <p>
                We may also collect non-personal information about you, including:
              </p>
              <ul>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>IP address</li>
                <li>Device information</li>
                <li>Usage data (pages visited, time spent on pages, etc.)</li>
                <li>Referral source</li>
              </ul>

              <h2>3. How We Collect Information</h2>
              <p>
                We collect information from you in various ways, including:
              </p>
              <h3>3.1 Direct Collection</h3>
              <p>
                We collect information directly from you when you:
              </p>
              <ul>
                <li>Register for an account</li>
                <li>Place an order</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact our customer service</li>
                <li>Participate in surveys or promotions</li>
                <li>Post reviews or comments</li>
              </ul>

              <h3>3.2 Automated Collection</h3>
              <p>
                We automatically collect certain information when you visit, use, or navigate our Services. This information may include your IP address, browser type, operating system, referring URLs, device information, and browsing actions and patterns.
              </p>

              <h3>3.3 Cookies and Similar Technologies</h3>
              <p>
                We use cookies and similar tracking technologies to track activity on our Services and to hold certain information. Cookies are small data files placed on your device when you visit a website. We use cookies to:
              </p>
              <ul>
                <li>Remember your preferences and settings</li>
                <li>Understand how you use our Services</li>
                <li>Improve our Services</li>
                <li>Provide personalized content and advertisements</li>
                <li>Analyze the performance of our Services</li>
              </ul>
              <p>
                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Services.
              </p>

              <h2>4. How We Use Your Information</h2>
              <p>
                We may use the information we collect for various purposes, including:
              </p>
              <ul>
                <li>Providing, maintaining, and improving our Services</li>
                <li>Processing and fulfilling your orders</li>
                <li>Sending order confirmations and updates</li>
                <li>Responding to your inquiries and providing customer support</li>
                <li>Sending promotional emails and newsletters (if you have opted in)</li>
                <li>Personalizing your experience on our Services</li>
                <li>Analyzing usage patterns and trends</li>
                <li>Detecting, preventing, and addressing technical issues</li>
                <li>Complying with legal obligations</li>
              </ul>

              <h2>5. How We Share Your Information</h2>
              <p>
                We may share your information with third parties in the following circumstances:
              </p>
              <h3>5.1 Service Providers</h3>
              <p>
                We may share your information with third-party service providers who perform services on our behalf, such as payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
              </p>

              <h3>5.2 Business Partners</h3>
              <p>
                We may share your information with our business partners to offer you certain products, services, or promotions.
              </p>

              <h3>5.3 Legal Requirements</h3>
              <p>
                We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or a government agency).
              </p>

              <h3>5.4 Business Transfers</h3>
              <p>
                We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
              </p>

              <h3>5.5 With Your Consent</h3>
              <p>
                We may share your information with third parties when we have your consent to do so.
              </p>

              <h2>6. Data Security</h2>
              <p>
                We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk.
              </p>

              <h2>7. Data Retention</h2>
              <p>
                We will retain your personal information only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use your information to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>

              <h2>8. Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>The right to access the personal information we have about you</li>
                <li>The right to rectify inaccurate personal information</li>
                <li>The right to request the deletion of your personal information</li>
                <li>The right to object to the processing of your personal information</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>

              <h2>9. Marketing Communications</h2>
              <p>
                You can opt out of receiving marketing communications from us by following the unsubscribe instructions included in our marketing communications or by contacting us using the information provided in the "Contact Us" section below.
              </p>

              <h2>10. Children's Privacy</h2>
              <p>
                Our Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from children without verification of parental consent, we will take steps to remove that information from our servers.
              </p>

              <h2>11. Third-Party Websites</h2>
              <p>
                Our Services may contain links to third-party websites and applications. We are not responsible for the privacy practices or the content of these third-party sites. We encourage you to read the privacy policy of every website you visit.
              </p>

              <h2>12. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date at the bottom of this page. You are advised to review this Privacy Policy periodically for any changes.
              </p>

              <h2>13. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul>
                <li>Email: privacy@mispri.com</li>
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
                  <Link href="/terms-conditions">Terms & Conditions</Link>
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
