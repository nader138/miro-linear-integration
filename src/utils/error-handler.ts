import { z } from 'zod';
import { isApiError } from '../types/errors';

export function handleError(error: unknown): void {
    if (error instanceof z.ZodError) {
        console.error('Validation error:');
        error.errors.forEach((err) => {
            console.error(`- ${err.path.join('.')}: ${err.message}`);
        });
    } else if (isApiError(error)) {
        console.error(`${error.name}:`, error.message);
        if ('status' in error) {
            console.error('Status:', error.status);
        }
        if ('cause' in error && error.cause) {
            console.error('Cause:', error.cause);
        }
    } else if (error instanceof Error) {
        console.error('Error:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    } else {
        console.error('Unknown error:', error);
    }
}