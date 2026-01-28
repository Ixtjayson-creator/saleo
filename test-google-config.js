const { OAuth2Client } = require('google-auth-library');
require('dotenv').config({ path: '.env.local' });

async function testGoogleConfig() {
    console.log("Checking Google Ads Configuration...");

    const clientID = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const devToken = process.env.GOOGLE_DEVELOPER_TOKEN;

    if (!clientID || !clientSecret || !devToken) {
        console.error("❌ Missing one or more environment variables in .env.local!");
        return;
    }

    console.log("✅ Credentials found.");

    try {
        const oauth2Client = new OAuth2Client(clientID, clientSecret);
        console.log("✅ OAuth2Client initialized successfully.");

        console.log("\nNext Steps for real data:");
        console.log("1. Add a 'Connect' button to your UI to get a real Access Token.");
        console.log("2. Use cases like 'syncGoogleAdsSpend' will then start working.");

    } catch (err) {
        console.error("❌ Error initializing client:", err.message);
    }
}

testGoogleConfig();
