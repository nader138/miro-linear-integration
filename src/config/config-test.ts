const dotenv = require('dotenv');
const { z } = require('zod');

// Load .env file
dotenv.config();

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
} catch (error) {
    if (error instanceof z.ZodError) {
        console.error('Invalid environment variables:', error.errors);
    } else {
        console.error('An error occurred:', error);
    }
}