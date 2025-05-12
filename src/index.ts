import { config } from 'dotenv';
import { z } from 'zod';
import { MiroClient } from './clients/miro';
import { LinearClient } from './clients/linear';
import { handleError } from './utils/error-handler';

const envSchema = z.object({
    MIRO_ACCESS_TOKEN: z.string().min(1, "MIRO_ACCESS_TOKEN is required"),
    MIRO_BOARD_ID: z.string().min(1, "MIRO_BOARD_ID is required"),
    LINEAR_API_KEY: z.string().min(1, "LINEAR_API_KEY is required"),
    LINEAR_TEAM_ID: z.string().min(1, "LINEAR_TEAM_ID is required"),
});

config();

try {
    const env = envSchema.parse(process.env);

    const miroClient = new MiroClient(env.MIRO_ACCESS_TOKEN);
    const linearClient = new LinearClient(env.LINEAR_API_KEY);

    async function createStickyNoteAndIssue() {
        try {
            const currentDate = "2025-05-11 19:20:13"; // Using your provided current date
            const currentUser = "nader138"; // Using your provided username

            console.log('Creating sticky note...');
            const sticky = await miroClient.createStickyNote({
                boardId: env.MIRO_BOARD_ID,
                content: `Task created by @${currentUser}\nDate: ${currentDate}`,
                position: { x: 0, y: 0 }
            });
            console.log('✅ Created Miro sticky note:', sticky.id);

            console.log('Creating Linear issue...');
            const issue = await linearClient.createIssue({
                title: `Task from Miro (created by @${currentUser})`,
                description: [
                    `Created from Miro sticky note: ${sticky.id}`,
                    `Created by: @${currentUser}`,
                    `Date: ${currentDate}`,
                    `Content: ${sticky.content}`
                ].join('\n'),
                teamId: env.LINEAR_TEAM_ID,
            });
            console.log('✅ Created Linear issue:', issue.url);

            return { sticky, issue };
        } catch (error: unknown) {
            handleError(error);
            throw error;
        }
    }

    // Run the integration
    createStickyNoteAndIssue().catch((error) => {
        console.error('Failed to create sticky note and issue:', error);
        process.exit(1);
    });

} catch (error: unknown) {
    handleError(error);
    process.exit(1);
}