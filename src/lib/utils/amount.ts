export const sanitizeAmountInput = (value: string) => value.replace(/\D/g, '') || '0';
