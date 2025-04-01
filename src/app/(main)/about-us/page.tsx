import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Award, Users, Heart, Truck, Clock, Gift } from 'lucide-react';

export const metadata = {
  title: 'About Us | MISPRI',
  description: 'Learn about MISPRI, our story, mission, and values.',
};

export default function AboutUsPage() {
  const values = [
    {
      icon: <Award className="h-8 w-8 text-pink-600" />,
      title: 'Quality',
      description: 'We source only the freshest flowers and premium ingredients for our products.'
    },
    {
      icon: <Users className="h-8 w-8 text-pink-600" />,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do.'
    },
    {
      icon: <Heart className="h-8 w-8 text-pink-600" />,
      title: 'Passion',
      description: 'We are passionate about making your special moments memorable.'
    },
    {
      icon: <Truck className="h-8 w-8 text-pink-600" />,
      title: 'Reliability',
      description: 'We deliver on time, every time, with care and precision.'
    },
    {
      icon: <Clock className="h-8 w-8 text-pink-600" />,
      title: 'Innovation',
      description: 'We constantly innovate to bring you unique and creative gift options.'
    },
    {
      icon: <Gift className="h-8 w-8 text-pink-600" />,
      title: 'Joy',
      description: 'We believe in spreading joy and happiness through our products.'
    },
  ];

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="bg-pink-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Story</h1>
            <p className="text-lg text-gray-600 mb-8">
              Bringing joy and happiness through beautiful flowers, delicious cakes, and thoughtful gifts since 2023.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative h-80 md:h-full">
              <Image
                src="/images/about-mission.jpg"
                alt="Our Mission"
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                At MISPRI, our mission is to help people express their emotions and celebrate special moments through beautiful flowers, delicious cakes, and thoughtful gifts.
              </p>
              <p className="text-gray-600 mb-4">
                We believe that every occasion deserves to be celebrated, and every emotion deserves to be expressed. Whether it's a birthday, anniversary, wedding, or just a simple gesture of love, we're here to help you make it special.
              </p>
              <p className="text-gray-600 mb-6">
                Our team works tirelessly to ensure that every product we deliver is of the highest quality, and every customer experience is exceptional.
              </p>
              <Button asChild className="bg-pink-600 hover:bg-pink-700">
                <Link href="/products">Explore Our Products</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-gray-600">
              These core values guide everything we do at MISPRI.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center bg-pink-50 rounded-full p-3 mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-gray-600">
              The passionate people behind MISPRI who work tirelessly to bring joy to your special moments.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((member) => (
              <div key={member} className="text-center">
                <div className="relative h-64 w-64 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={`/images/team-member-${member}.jpg`}
                    alt={`Team Member ${member}`}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-1">Team Member {member}</h3>
                <p className="text-gray-500 mb-2">Position</p>
                <p className="text-gray-600 max-w-xs mx-auto">
                  Short bio about the team member and their role at MISPRI.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-pink-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Brighten Someone's Day?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Explore our collection of flowers, cakes, and gifts to find the perfect way to express your feelings.
            </p>
            <Button asChild size="lg" className="bg-pink-600 hover:bg-pink-700">
              <Link href="/products">Shop Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
