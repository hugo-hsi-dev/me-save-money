import { error } from '@sveltejs/kit';

export const ERRORS = {
	FORBIDDEN: () =>
		error(403, {
			message: 'Access denied. You do not have permission to access this resource.'
		}),
	INTERNAL_SERVER_ERROR: () =>
		error(500, {
			message: 'An unexpected error occurred. Please try again later.'
		}),
	NOT_FOUND: () => error(404, { message: 'The requested resource could not be found.' }),
	UNAUTHORIZED: () =>
		error(401, {
			message: 'Authentication required. Please log in to access this resource.'
		})
};
