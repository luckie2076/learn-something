const user = { name: 'Tom' };
const city = user?.address?.city ?? 'unknown';
console.log(city);
