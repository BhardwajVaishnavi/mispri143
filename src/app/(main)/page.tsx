import HeroSlider from '@/components/home/HeroSlider';
import CategorySection from '@/components/home/CategorySection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import OccasionsSection from '@/components/home/OccasionsSection';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import GiftFinderTool from '@/components/home/GiftFinderTool';
import SpecialDeliverySection from '@/components/home/SpecialDeliverySection';
import CorporateGiftingSection from '@/components/home/CorporateGiftingSection';
import BlogSection from '@/components/home/BlogSection';
import AppDownloadSection from '@/components/home/AppDownloadSection';
import CustomerSupportSection from '@/components/home/CustomerSupportSection';
import CityDeliverySection from '@/components/home/CityDeliverySection';
import InternationalDeliverySection from '@/components/home/InternationalDeliverySection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSlider />
      <CategorySection />
      <GiftFinderTool />
      <FeaturedProducts />
      <SpecialDeliverySection />
      <OccasionsSection />
      <CorporateGiftingSection />
      <BlogSection />
      <TestimonialsSection />
      <AppDownloadSection />
      <CityDeliverySection />
      <InternationalDeliverySection />
      <CustomerSupportSection />
      <FeaturesSection />

      {/* Admin link - will be removed in production */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/admin"
          className="bg-gray-800 hover:bg-gray-700 text-white text-sm font-medium py-2 px-4 rounded-full shadow-lg flex items-center"
        >
          Admin Dashboard
        </a>
      </div>
    </main>
  )
}
