import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
    MIRO_ACCESS_TOKEN: z.string().min(1, "MIRO_ACCESS_TOKEN is required"),
    MIRO_BOARD_ID: z.string().min(1, "MIRO_BOARD_ID is required"),
    LINEAR_API_KEY: z.string().min(1, "LINEAR_API_KEY is required"),
    LINEAR_TEAM_ID: z.string().min(1, "LINEAR_TEAM_ID is required"),
});

export const env = envSchema.parse(process.env);