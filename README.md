# Miro–Linear Integration: Self-Hosting Guide

This app syncs Miro sticky notes with Linear issues in real time, supporting create, update, and delete events. It is robust, production-ready, and designed for self-hosting.

---

## Features
- **Sync Miro sticky notes to Linear issues** (create, update, delete)
- **Webhook signature verification** for security
- **Challenge-response** for Miro webhook verification
- **Strong typing and validation** using Zod
- **Robust error handling**
- **Ready for SaaS/multi-user extension**

---

## Prerequisites
- Node.js v18 or newer
- A Linear API key ([how to get one](https://developers.linear.app/docs/graphql/getting-started#api-keys))
- A Miro account with access to the [Miro Developer Platform](https://developers.miro.com/)
- A public HTTPS endpoint (for Miro webhooks; use [ngrok](https://ngrok.com/) for local development)

---

## Setup

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd miro-linear-integration
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```
# .env
LINEAR_API_KEY=your-linear-api-key
MIRO_WEBHOOK_SECRET=your-miro-webhook-secret
PORT=3000
```

- `LINEAR_API_KEY`: Your Linear personal API key
- `MIRO_WEBHOOK_SECRET`: A secret string for verifying Miro webhook signatures (set this in your Miro webhook config)
- `PORT`: Port to run the server (default: 3000)

4. **Start the server**

```bash
npm run build
npm start
```

Or for development (with auto-reload):

```bash
npm run dev
```

5. **Expose your server to the internet (for local development)**

If running locally, use ngrok:

```bash
ngrok http 3000
```

Copy the HTTPS URL provided by ngrok.

6. **Register the webhook in Miro**

- Go to your Miro app settings in the [Miro Developer Platform](https://developers.miro.com/docs/webhooks)
- Set the webhook URL to `https://<your-domain-or-ngrok-url>/webhooks/miro`
- Use the same secret as `MIRO_WEBHOOK_SECRET`
- Subscribe to sticky note events (create, update, delete)

---

## Configuration
- Edit `src/config/env.ts` or use environment variables to adjust settings.
- Team/project mapping logic can be customized in `src/webhooks/miro-handler.ts`.

---

## Deployment
- Deploy to any Node.js-compatible host (Vercel, Heroku, AWS, DigitalOcean, etc.)
- Ensure your endpoint is HTTPS-accessible for Miro webhooks.

---

## License
Apache 2.0 (for self-hosted use). For SaaS/commercial use, contact the author.

---

## Troubleshooting
- **Webhook not triggering?** Ensure your endpoint is public and HTTPS, and the secret matches.
- **Signature errors?** Double-check the `MIRO_WEBHOOK_SECRET` and that your server uses the raw request body for verification.
- **Linear errors?** Check your API key and team/project configuration.

---

## Contributing
PRs are welcome for bugfixes and improvements. For major features, open an issue first.

---

## Security
- Keep your API keys and secrets safe.
- Use HTTPS in production.

---

## Contact
For questions or commercial licensing, open an issue or contact the maintainer.
