import { z } from 'zod';

export function handleError(error: unknown): void {
    if (error instanceof z.ZodError) {
        console.error('Validation error:');
        error.errors.forEach((err) => {
            console.error(`- ${err.path.join('.')}: ${err.message}`);
        });
    } else if (error instanceof Error) {
        console.error('Error:', error.message);
        if (error.stack) {
            console.error('Stack trace:', error.stack);
        }
    } else {
        console.error('Unknown error:', error);
    }
}