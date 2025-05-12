import { LinearClient } from '@linear/sdk';
import { config } from 'dotenv';

config();

async function getTeams() {
    const linearApiKey = process.env.LINEAR_API_KEY;

    if (!linearApiKey) {
        console.error('❌ LINEAR_API_KEY is not set in .env file');
        process.exit(1);
    }

    const linearClient = new LinearClient({ apiKey: linearApiKey });

    try {
        console.log('Fetching teams...');
        const teams = await linearClient.teams();

        console.log('\nAvailable teams:');
        console.log('----------------');
        for (const team of teams.nodes) {
            console.log(`Team Name: ${team.name}`);
            console.log(`Team ID: ${team.id}`);
            console.log(`Team Key: ${team.key}`);
            console.log('----------------');
        }
    } catch (error) {
        console.error('❌ Failed to fetch teams:', error);
        process.exit(1);
    }
}

// Run the script
getTeams().catch(console.error);