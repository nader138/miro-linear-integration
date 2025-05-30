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
            const event = MiroWebhookEventSchema.parse(payload).event;

            console.log(`Processing Miro event: ${event.type}`, {
                timestamp: event.item.createdAt,
                user: event.item.createdBy.id,
                eventId: event.item.id,
            });

            switch (event.type) {
                case 'create':
                    await this.handleItemCreated(event);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            handleError(error);
            throw error;
        }
    }

    private async handleItemCreated(event: any): Promise<void> {
        if (event.item.type !== 'sticky_note') {
            return;
        }

        const item = event.item;

        try {
            await this.linearClient.createIssue({
                teamId: this.linearTeamId,
                title: `Miro Task: ${item.content || 'New Task'}`,
                description: [
                    `Created from Miro sticky note: ${item.id}`,
                    `Board ID: ${event.boardId}`,
                    `Created at: ${item.createdAt}`,
                    `Created by: ${item.createdBy.id}`,
                    `Content: ${item.content || 'No content'}`
                ].join('\n')
            });

            console.log('Successfully created Linear issue for sticky note:', item.id);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }
}