import { config } from 'dotenv';
import { z } from 'zod';
import { handleError } from '../utils/error-handler';


// Load .env file
config();

// Define a schema for our environment variables
const envSchema = z.object({
    MIRO_ACCESS_TOKEN: z.string().min(1, "MIRO_ACCESS_TOKEN is required"),
    LINEAR_API_KEY: z.string().min(1, "LINEAR_API_KEY is required"),
});

try {
    // Validate environment variables
    const env = envSchema.parse(process.env);
    console.log('Environment variables are valid!');
    // Don't log the actual tokens in production!
    console.log('MIRO_ACCESS_TOKEN length:', env.MIRO_ACCESS_TOKEN.length);
    console.log('LINEAR_API_KEY length:', env.LINEAR_API_KEY.length);
} catch (error: unknown) {
    handleError(error);
}