import { MiroClient } from '../clients/miro';
import { LinearClient } from '../clients/linear';
import { BaseWebhookHandler } from './base-handler';
import { MiroWebhookEvent, MiroWebhookEventSchema } from '../types/webhooks/miro';
import { z } from 'zod';
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
                timestamp: event.item.createdAt || '',
                user: event.item.createdBy?.id || '',
                eventId: event.item.id,
            });

            switch (event.type) {
                case 'create':
                    await this.handleItemCreated(event);
                    break;
                case 'update':
                    await this.handleItemUpdated(event);
                    break;
                case 'delete':
                    await this.handleItemDeleted(event);
                    break;
                default:
                    console.log(`Unhandled event type: ${event.type}`);
            }
        } catch (error) {
            handleError(error);
            throw error;
        }
    }

    // Utility to strip HTML tags from a string
    private stripHtmlTags(input: string): string {
        return input.replace(/<[^>]*>/g, '').trim();
    }

    private async handleItemCreated(event: z.infer<typeof MiroWebhookEventSchema>['event']): Promise<void> {
        if (event.item.type !== 'sticky_note') {
            return;
        }

        const item = event.item;
        const rawContent = item.data?.content || 'New Task';
        const content = this.stripHtmlTags(rawContent);

        try {
            await this.linearClient.createIssue({
                teamId: this.linearTeamId,
                title: `Miro Task: ${content}`,
                description: [
                    `Created from Miro sticky note: ${item.id}`,
                    `Board ID: ${event.boardId}`,
                    `Created at: ${item.createdAt || ''}`,
                    `Created by: ${item.createdBy?.id || ''}`,
                    `Content: ${content || 'No content'}`
                ].join('\n')
            });

            console.log('Successfully created Linear issue for sticky note:', item.id);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }

    private async handleItemUpdated(event: z.infer<typeof MiroWebhookEventSchema>["event"]): Promise<void> {
        if (event.item.type && event.item.type !== 'sticky_note') {
            return;
        }
        try {
            const stickyNoteId = event.item.id;
            const issue = await this.linearClient.findIssueByStickyNoteId(stickyNoteId);
            if (!issue) {
                console.log('No matching Linear issue found for sticky note:', stickyNoteId);
                return;
            }
            const rawContent = event.item.data?.content || 'Updated Task';
            const content = this.stripHtmlTags(rawContent);
            await this.linearClient.updateIssue(issue.id, {
                title: `Miro Task: ${content}`,
                description: [
                    `Created from Miro sticky note: ${event.item.id}`,
                    `Board ID: ${event.boardId}`,
                    `Created at: ${event.item.createdAt || ''}`,
                    `Created by: ${event.item.createdBy?.id || ''}`,
                    `Content: ${content || 'No content'}`
                ].join('\n')
            });
            console.log('Successfully updated Linear issue for sticky note:', stickyNoteId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }

    private async handleItemDeleted(event: z.infer<typeof MiroWebhookEventSchema>["event"]): Promise<void> {
        if (event.item.type && event.item.type !== 'sticky_note') {
            return;
        }
        try {
            const stickyNoteId = event.item.id;
            const issue = await this.linearClient.findIssueByStickyNoteId(stickyNoteId);
            if (!issue) {
                console.log('No matching Linear issue found for sticky note:', stickyNoteId);
                return;
            }
            await this.linearClient.deleteIssue(issue.id);
            console.log('Successfully deleted Linear issue for sticky note:', stickyNoteId);
        } catch (error) {
            handleError(error);
            throw error;
        }
    }
}