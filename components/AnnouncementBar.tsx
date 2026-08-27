import React from "react";
import { FREE_SHIPPING_THRESHOLD_INR } from "@/lib/shipping";

export default function AnnouncementBar() {
  return (
    <div style={{
      backgroundColor: "var(--sage)",
      color: "var(--white)",
      textAlign: "center",
      padding: "8px 16px",
      fontSize: "var(--fs-xs)",
      fontWeight: 700,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      fontFamily: "var(--font-lato), sans-serif",
    }}>
      Free shipping on orders above ₹{FREE_SHIPPING_THRESHOLD_INR.toLocaleString("en-IN")}/-
    </div>
  );
}
