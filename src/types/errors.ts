import type { Response } from 'cross-fetch';
import { z } from 'zod';

export class MiroApiError extends Error {
    constructor(
        message: string,
        public readonly status?: number,
        public readonly response?: Response
    ) {
        super(message);
        this.name = 'MiroApiError';
    }
}

export class LinearApiError extends Error {
    constructor(
        message: string,
        public readonly cause?: unknown
    ) {
        super(message);
        this.name = 'LinearApiError';
    }
}

export function isApiError(error: unknown): error is MiroApiError | LinearApiError {
    return error instanceof MiroApiError || error instanceof LinearApiError;
}