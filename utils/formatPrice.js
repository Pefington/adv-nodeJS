export function formatPrice(priceInCents) {
  const intl = Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency: 'EUR',
  });
  return intl.format(priceInCents / 100);
}
