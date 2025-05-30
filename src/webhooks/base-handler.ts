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
        const digest = hmac.update(payload).digest('base64');
        const sigBuf = Buffer.from(signature, 'base64');
        const digestBuf = Buffer.from(digest, 'base64');


        // Log for debugging
        console.log('Signature from header:', signature);
        console.log('Computed digest:', digest);
        console.log('Signature length:', signature.length, 'Digest length:', digest.length);
        if (sigBuf.length !== digestBuf.length) return false;
        return crypto.timingSafeEqual(sigBuf, digestBuf);
    }

    protected abstract handleEvent(payload: any): Promise<void>;

    public async process(req: Request, res: Response): Promise<void> {
        // const signature = req.headers['x-miro-signature'];
        const signature = req.headers['x-miro-hmac-sha256'];
        // Use the raw body captured by express.json verify
        const rawBody = (req as any).rawBody;
        console.log('Raw body:', rawBody);
        console.log('Headers:');
        console.log(req.headers);
        console.log('Request URL:', req.originalUrl);




        if (!signature || Array.isArray(signature)) {
            res.status(401).json({ error: 'Invalid signature' });
            return;
        }

        if (!this.verifySignature(rawBody, signature)) {
            res.status(401).json({ error: 'Invalid signature' });
            return;
        }

        // Handle Miro challenge (webhook)
        if (req.body && typeof req.body.challenge === 'string') {
            res.status(200).json({ challenge: req.body.challenge });
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