import type { z } from 'zod';

export function getFieldError(
	errors: undefined | z.ZodIssue[],
	fieldName: string
): string | undefined {
	return errors?.find((e) => e.path[0] === fieldName)?.message;
}
