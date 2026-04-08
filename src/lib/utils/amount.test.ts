import { describe, expect, it } from 'vitest';

import { sanitizeAmountInput } from './amount';

describe('sanitizeAmountInput', () => {
	it('removes non-digits from the amount input', () => {
		expect(sanitizeAmountInput('12a3.4b5')).toBe('12345');
	});

	it('falls back to zero when the input is empty', () => {
		expect(sanitizeAmountInput('')).toBe('0');
	});
});
