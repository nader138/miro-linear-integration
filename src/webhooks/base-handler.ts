import crypto from 'crypto';
import { Request, Response } from 'express';

export abstract class BaseWebhookHandler {
    constructor(protected readonly secret: string) {
        if (!secret) {
            throw new Error('Webhook secret is required');
        }
    }

    protected verifySignature(payload: string, signature: string): boolean {
        const hmac = crypto.createHmac('sha256', this.secret);
        const digest = hmac.update(payload).digest('hex');
        return crypto.timingSafeEqual(
            Buffer.from(signature),
            Buffer.from(digest)
        );
    }

    protected abstract handleEvent(payload: any): Promise<void>;

    public async process(req: Request, res: Response): Promise<void> {
        const signature = req.headers['x-miro-signature'];

        if (!signature || Array.isArray(signature)) {
            res.status(401).json({ error: 'Invalid signature' });
            return;
        }

        const rawBody = JSON.stringify(req.body);

        if (!this.verifySignature(rawBody, signature)) {
            res.status(401).json({ error: 'Invalid signature' });
            return;
        }

        try {
            await this.handleEvent(req.body);
            res.status(200).json({ status: 'ok' });
        } catch (error) {
            console.error('Error processing webhook:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}