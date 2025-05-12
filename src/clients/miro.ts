import fetch, { Response } from 'cross-fetch';
import { MiroStickyNote, CreateStickyNoteParams } from '../types';
import { MiroApiError } from '../types/errors';
import { handleError } from '../utils/error-handler';

export class MiroClient {
    private readonly baseUrl = 'https://api.miro.com/v2';
    private readonly headers: Record<string, string>;

    constructor(private readonly token: string) {
        if (!token) {
            throw new Error('Miro access token is required');
        }

        this.headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        const responseText = await response.text();
        let responseData;

        try {
            responseData = responseText ? JSON.parse(responseText) : null;
        } catch (e) {
            responseData = responseText;
        }

        if (!response.ok) {
            throw new MiroApiError(
                `Miro API error: ${response.status} ${response.statusText}\nDetails: ${JSON.stringify(responseData)}`,
                response.status,
                response
            );
        }

        return responseData as T;
    }

    async createStickyNote({
        boardId,
        content,
        position = { x: 0, y: 0 }
    }: CreateStickyNoteParams): Promise<MiroStickyNote> {
        if (!boardId) {
            throw new Error('Board ID is required');
        }

        try {
            const response = await fetch(
                `${this.baseUrl}/boards/${boardId}/sticky_notes`,
                {
                    method: 'POST',
                    headers: this.headers,
                    body: JSON.stringify({
                        data: {
                            content: content,
                            shape: 'square',
                        },

                        position: {
                            origin: 'center',
                            x: position.x,
                            y: position.y
                        },

                        style: {
                            fillColor: 'light_yellow',
                            textAlign: 'center',
                            textAlignVertical: 'middle'
                        }
                    })
                }
            );

            return await this.handleResponse<MiroStickyNote>(response);
        } catch (error: unknown) {
            handleError(error);
            throw error;
        }
    }
}