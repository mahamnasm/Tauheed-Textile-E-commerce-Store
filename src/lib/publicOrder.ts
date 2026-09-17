type TrackableItem = {
  variantDetails?: string | null;
  quantity: number;
  price: number;
  total: number;
  product?: { title?: string | null; slug?: string | null } | null;
};

type TrackableOrder = {
  orderNumber: string;
  customerName: string;
  city: string;
  province: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  trackingNumber?: string | null;
  courierName?: string | null;
  courierUrl?: string | null;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  createdAt: Date | string;
  items?: TrackableItem[];
};

export function normalizePkPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("92") && digits.length >= 12) {
    return digits.slice(-10);
  }
  if (digits.startsWith("0") && digits.length >= 11) {
    return digits.slice(-10);
  }
  return digits.slice(-10);
}

export function toPublicOrder(order: TrackableOrder) {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    city: order.city,
    province: order.province,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    orderStatus: order.orderStatus,
    trackingNumber: order.trackingNumber || null,
    courierName: order.courierName || null,
    courierUrl: order.courierUrl || null,
    subtotal: order.subtotal,
    shippingFee: order.shippingFee,
    discount: order.discount,
    total: order.total,
    createdAt: order.createdAt,
    items: (order.items || []).map((item) => ({
      variantDetails: item.variantDetails || "",
      quantity: item.quantity,
      price: item.price,
      total: item.total,
      product: item.product
        ? { title: item.product.title, slug: item.product.slug }
        : undefined,
    })),
  };
}
