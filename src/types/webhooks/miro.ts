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
            type: z.string(),
            createdAt: z.string(),
            createdBy: z.object({
                id: z.string(),
                type: z.string()
            }),
            data: z.object({
                content: z.string().optional(),
                shape: z.string().optional()
            }).passthrough(),
            geometry: z.object({
                width: z.number(),
                height: z.number()
            }),
            modifiedAt: z.string(),
            modifiedBy: z.object({
                id: z.string(),
                type: z.string()
            }),
            position: z.object({
                x: z.number(),
                y: z.number(),
                origin: z.string(),
                relativeTo: z.string()
            }),
            style: z.object({
                fillColor: z.string(),
                textAlign: z.string(),
                textAlignVertical: z.string()
            })
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