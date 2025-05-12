import { z } from 'zod';

// Define the Miro webhook event types
export const MiroWebhookEventSchema = z.object({
    eventType: z.enum(['item.create', 'item.update', 'item.delete']),
    webhookId: z.string(),
    timestamp: z.number(),
    boardId: z.string(),
    event: z.object({
        id: z.string(),
        type: z.string(),
        data: z.object({
            id: z.string(),
            type: z.string().optional(),
            content: z.string().optional(),
        }).passthrough(),
    }),
});

export type MiroWebhookEvent = z.infer<typeof MiroWebhookEventSchema>;

// Webhook configuration type
export interface WebhookConfig {
    url: string;
    secret: string;
    events: string[];
}