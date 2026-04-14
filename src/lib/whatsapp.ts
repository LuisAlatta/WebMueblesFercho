export interface WhatsAppMessageParams {
  productName: string;
  material?: string;
  measurement?: string;
  price?: number | string;
}

export function buildWhatsAppUrl(params: WhatsAppMessageParams): string {
  const { productName, material, measurement, price } = params;
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

  let message = `Hola! Me interesa ${productName}`;
  if (material || measurement) {
    const details = [material, measurement].filter(Boolean).join(" - ");
    message += ` en ${details}`;
  }
  if (price) {
    const formatted = new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
      minimumFractionDigits: 0,
    }).format(Number(price));
    message += ` (${formatted})`;
  }
  message += ". Quisiera mas informacion.";

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildSimpleWhatsAppUrl(message?: string): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const text = message ?? "Hola! Quisiera mas informacion sobre sus muebles.";
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
