import React from "react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BrandValueStrip from "@/components/BrandValueStrip";
import ShopByCategory from "@/components/ShopByCategory";
import NewArrivals from "@/components/NewArrivals";
import MakerStory from "@/components/MakerStory";
import WhyHandmade from "@/components/WhyHandmade";
import CustomOrders from "@/components/CustomOrders";
import InstagramGrid from "@/components/InstagramGrid";
import Reviews from "@/components/Reviews";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      {/* 1. Announcement Bar */}
      <AnnouncementBar />
      
      {/* 2. Navigation Header */}
      <Header />
      
      <main>
        {/* 3. Hero Section */}
        <Hero />
        
        {/* 4. Brand Value Strip */}
        <BrandValueStrip />
        
        {/* 5. Shop By Category */}
        <ShopByCategory />
        
        {/* 6. Featured / New Products */}
        <NewArrivals />
        
        {/* 7. Maker Story (Meet Anjali) */}
        <MakerStory />
        
        {/* 8. Why Handmade */}
        <WhyHandmade />
        
        {/* 9. Custom Orders Inquiry */}
        <CustomOrders />
        
        {/* 10. Behind the Loops (Instagram Feed Grid) */}
        <InstagramGrid />
        
        {/* 11. Customer Reviews */}
        <Reviews />
      </main>

      {/* 12. Footer (including Newsletter Signup) */}
      <Footer />
    </>
  );
}
