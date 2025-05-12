import { MiroClient } from '../clients/miro';
import { LinearClient } from '../clients/linear';
import { BaseWebhookHandler } from './base-handler';
import { MiroWebhookEvent, MiroWebhookEventSchema } from '../types/webhooks/miro';
import { handleError } from '../utils/error-handler';

export class MiroWebhookHandler extends BaseWebhookHandler {
    constructor(
        secret: string,
        private readonly miroClient: MiroClient,
        private readonly linearClient: LinearClient,
        private readonly linearTeamId: string
    ) {
        super(secret);
    }

    protected async handleEvent(payload: unknown): Promise<void> {
        try {
            // Validate and parse the webhook payload
            const event = MiroWebhookEventSchema.parse(payload);

            console.log(`Processing Miro event: ${event.eventType}`, {
                timestamp: new Date().toISOString(),
                user: 'nader138',
                eventId: event.event.id
            });

            switch (event.eventType) {
                case 'item.create':
                    await this.handleItemCreated(event);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.eventType}`);
            }
        } catch (error) {
            handleError(error);
            throw error;
        }
    }

    private async handleItemCreated(event: MiroWebhookEvent): Promise<void> {
        if (event.event.type !== 'sticky_note') {
            return;
        }

        const { data } = event.event;

        try {
            await this.linearClient.createIssue({
                teamId: this.linearTeamId,
                title: `Miro Task: ${data.content || 'New Task'}`,
                description: [
                    `Created from Miro sticky note: ${data.id}`,
                    `Board ID: ${event.boardId}`,
                    `Created at: 2025-05-12 19:30:10`,
                    `Created by: nader138`,
                    `Content: ${data.content || 'No content'}`
                ].join('\n')
            });

            console.log('Successfully created Linear issue for sticky note:', data.id);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }
}