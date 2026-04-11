console.log('NEW PRICES IN NGN:');
console.log('=================');

const prices = {
  'Rice 25kg': 3300,
  'Rice 50kg': 6500,
  'Rice 10kg': 1350,
  'Rice 5kg': 550,
  'Investment Slot': 5000,
  'Investment Reg': 500,
  'Monthly Due': 200,
  'Coop Reg': 250
};

Object.entries(prices).forEach(([name, price]) => {
  const kobo = price * 100;
  const exceedsLimit = kobo > 1000000;
  console.log(`${name}: ₦${price.toLocaleString()} (kobo: ${kobo.toLocaleString()}) ${exceedsLimit ? '⚠️ OVER LIMIT' : '✅'}`);
});

console.log('\n5 RICE 50KG ORDERS (worst case):');
const total = 6500 * 5 * 100;
console.log(`Total: ${total.toLocaleString()} kobo = ₦${(total/100).toLocaleString()}`);
console.log(`Under 1M NGN daily limit? ${total/100 < 1000000 ? '✅ YES' : '⚠️ NO'}`);

console.log('\n100 RICE 50KG ORDERS:');
const total2 = 6500 * 100 * 100;
console.log(`Total: ${total2.toLocaleString()} kobo = ₦${(total2/100).toLocaleString()}`);
console.log(`Under 1M NGN daily limit? ${total2/100 < 1000000 ? '✅ YES' : '⚠️ NO'}`);
