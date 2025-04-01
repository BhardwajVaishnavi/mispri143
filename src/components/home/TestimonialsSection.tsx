'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar?: string;
  rating: number;
  text: string;
  date: string;
}

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Mock testimonials data
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Priya Sharma',
      location: 'Mumbai',
      avatar: '/images/avatar-1.jpg',
      rating: 5,
      text: 'I ordered a bouquet of roses for my wifes birthday and she absolutely loved it! The flowers were fresh and beautifully arranged. The delivery was on time and the packaging was excellent. Will definitely order again!',
      date: '15 June 2023'
    },
    {
      id: '2',
      name: 'Rahul Patel',
      location: 'Delhi',
      avatar: '/images/avatar-2.jpg',
      rating: 5,
      text: 'The cake I ordered for my parents anniversary was not only delicious but also looked exactly like the picture. Everyone at the party loved it. Thank you for making their day special!',
      date: '3 July 2023'
    },
    {
      id: '3',
      name: 'Ananya Gupta',
      location: 'Bangalore',
      avatar: '/images/avatar-3.jpg',
      rating: 4,
      text: 'I have ordered multiple times and have never been disappointed. The quality of products is consistently good. The only suggestion would be to add more variety to the gift options.',
      date: '22 August 2023'
    },
    {
      id: '4',
      name: 'Vikram Singh',
      location: 'Chennai',
      avatar: '/images/avatar-4.jpg',
      rating: 5,
      text: 'The same-day delivery service saved me when I forgot my anniversary! The combo of flowers and chocolates was perfect, and my wife was so surprised. Thank you for the excellent service!',
      date: '10 September 2023'
    },
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1));
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 5000);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1));
    setAutoplay(false);
    setTimeout(() => setAutoplay(true), 5000);
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay]);

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">What Our Customers Say</h2>
          <p className="text-gray-600 mt-2">Trusted by thousands of happy customers</p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Testimonial cards */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4"
                >
                  <div className="bg-gray-50 rounded-lg p-6 md:p-8 shadow-sm">
                    <div className="flex items-center mb-4">
                      <div className="mr-4">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden">
                          {testimonial.avatar ? (
                            <Image
                              src={testimonial.avatar}
                              alt={testimonial.name}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-300 flex items-center justify-center">
                              <span className="text-gray-600 text-xl font-semibold">
                                {testimonial.name.charAt(0)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.location}</p>
                      </div>
                      <div className="ml-auto">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 15.585l-7.07 3.707 1.35-7.87-5.72-5.573 7.91-1.149L10 0l3.53 7.7 7.91 1.149-5.72 5.573 1.35 7.87L10 15.585z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <p className="text-gray-500 text-xs text-right mt-1">{testimonial.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">"{testimonial.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={prevTestimonial}
          >
            <ChevronLeft className="h-6 w-6 text-gray-600" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
            onClick={nextTestimonial}
          >
            <ChevronRight className="h-6 w-6 text-gray-600" />
          </button>
          
          {/* Dots */}
          <div className="flex justify-center mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 w-2 rounded-full mx-1 transition-all ${
                  index === currentIndex ? 'bg-pink-600 w-6' : 'bg-gray-300'
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutoplay(false);
                  setTimeout(() => setAutoplay(true), 5000);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
