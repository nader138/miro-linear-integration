import { z } from 'zod';

// Define the Miro webhook event types
export const MiroWebhookEventSchema = z.object({
    eventType: z.literal('board_subscription'),
    eventTime: z.string(),
    appId: z.number(),
    users: z.array(z.number()),
    event: z.object({
        boardId: z.string(),
        type: z.enum(['create', 'update', 'delete']),
        item: z.object({
            id: z.string(),
            // All other fields are optional for delete events
            type: z.string().optional(),
            createdAt: z.string().optional(),
            createdBy: z.object({
                id: z.string(),
                type: z.string()
            }).optional(),
            data: z.object({
                content: z.string().optional(),
                shape: z.string().optional()
            }).passthrough().optional(),
            geometry: z.object({
                width: z.number(),
                height: z.number()
            }).optional(),
            modifiedAt: z.string().optional(),
            modifiedBy: z.object({
                id: z.string(),
                type: z.string()
            }).optional(),
            position: z.object({
                x: z.number(),
                y: z.number(),
                origin: z.string(),
                relativeTo: z.string()
            }).optional(),
            style: z.object({
                fillColor: z.string(),
                textAlign: z.string(),
                textAlignVertical: z.string()
            }).optional()
        })
    }),
});

export type MiroWebhookEvent = z.infer<typeof MiroWebhookEventSchema>;

// Webhook configuration type
export interface WebhookConfig {
    url: string;
    secret: string;
    events: string[];
}