
import { LinearClient as Linear, Issue } from '@linear/sdk';
import { LinearIssue, CreateLinearIssueParams } from '../types';
import { LinearApiError } from '../types/errors';
import { handleError } from '../utils/error-handler';

export class LinearClient {
    private readonly client: Linear;

    constructor(apiKey: string) {
        if (!apiKey) {
            throw new Error('Linear API key is required');
        }
        this.client = new Linear({ apiKey });
    }

    async createIssue({
        title,
        description = '',
        teamId
    }: CreateLinearIssueParams): Promise<LinearIssue> {
        if (!teamId) {
            throw new Error('Team ID is required');
        }

        try {
            // Create the issue
            const response = await this.client.createIssue({
                title,
                description,
                teamId
            });

            const { success, issue } = await response;

            if (!success || !issue) {
                throw new LinearApiError('Failed to create issue: No response from Linear API');
            }

            // Wait for the issue data to be available
            const issueData = await issue;

            // Get the state and handle the case where it might be undefined
            const issueState = await issueData.state;
            if (!issueState) {
                throw new LinearApiError('Failed to get issue state');
            }

            return {
                id: issueData.id,
                title: issueData.title,
                description: issueData.description ?? null,
                status: issueState.name,
                url: issueData.url
            };
        } catch (error: unknown) {
            if (error instanceof LinearApiError) {
                handleError(error);
                throw error;
            }
            // Wrap unknown errors in our custom error type
            const wrappedError = new LinearApiError(
                'Failed to create Linear issue',
                error
            );
            handleError(wrappedError);
            throw wrappedError;
        }
    }
}