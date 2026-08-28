import React from "react";
import Hero from "@/components/Hero";
import BrandValueStrip from "@/components/BrandValueStrip";
import ShopByCategory from "@/components/ShopByCategory";
import NewArrivals from "@/components/NewArrivals";
import MakerStory from "@/components/MakerStory";
import WhyHandmade from "@/components/WhyHandmade";
import CustomOrders from "@/components/CustomOrders";
import InstagramGrid from "@/components/InstagramGrid";
import Reviews from "@/components/Reviews";

export default function Home() {
  return (
    <main>
      <Hero />
      <BrandValueStrip />
      <ShopByCategory />
      <NewArrivals />
      <MakerStory />
      <WhyHandmade />
      <CustomOrders />
      <InstagramGrid />
      <Reviews />
    </main>
  );
}
