// Cart subtotal (before gift wrap and shipping) at or above which shipping is
// free. Shared by the storefront announcement bar and the Shiprocket quote API
// so the promise and the charge can never drift apart.
export const FREE_SHIPPING_THRESHOLD_INR = 999;

export function qualifiesForFreeShipping(cartValueInr: number) {
  return cartValueInr >= FREE_SHIPPING_THRESHOLD_INR;
}
