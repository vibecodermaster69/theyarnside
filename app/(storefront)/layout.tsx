import { CartProvider } from "@/components/CartProvider";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import CartBag from "@/components/CartBag";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <AnnouncementBar />
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <CartBag />
    </CartProvider>
  );
}
