export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount).replace('₫', 'đ');
}

export function validateVNPhone(phone: string): boolean {
  const vnf_regex = /((09|03|07|08|05)+[0-9]{8})\b/g;
  return vnf_regex.test(phone.trim());
}
