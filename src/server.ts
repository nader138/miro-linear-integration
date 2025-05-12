import express from 'express';
import { config } from 'dotenv';
import { z } from 'zod';
import { MiroClient } from './clients/miro';
import { LinearClient } from './clients/linear';
import { MiroWebhookHandler } from './webhooks/miro-handler';

config();

const envSchema = z.object({
    PORT: z.string().default('3000'),
    MIRO_ACCESS_TOKEN: z.string(),
    MIRO_WEBHOOK_SECRET: z.string(),
    LINEAR_API_KEY: z.string(),
    LINEAR_TEAM_ID: z.string(),
});

const app = express();
app.use(express.json());

try {
    const env = envSchema.parse(process.env);

    const miroClient = new MiroClient(env.MIRO_ACCESS_TOKEN);
    const linearClient = new LinearClient(env.LINEAR_API_KEY);

    const webhookHandler = new MiroWebhookHandler(
        env.MIRO_WEBHOOK_SECRET,
        miroClient,
        linearClient,
        env.LINEAR_TEAM_ID
    );

    app.post('/webhook/miro', (req, res) => {
        webhookHandler.process(req, res);
    });

    const port = parseInt(env.PORT, 10);
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
        console.log('Started at: 2025-05-12 19:30:10');
        console.log('Started by: nader138');
    });

} catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
}