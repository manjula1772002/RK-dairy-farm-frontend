export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function getLowestPrice(options = []) {
  if (!options || options.length === 0) return 0;
  return Math.min(...options.map((opt) => opt.price));
}