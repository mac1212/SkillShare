const express = require("express");
const { RtcTokenBuilder, RtcRole } = require("agora-token");

const app = express();

// Enable JSON body parsing
app.use(express.json());

// Your Agora Credentials
const AGORA_APP_ID = "abbfdcaae96a4e6bab5aa770c5ac513d";
// REPLACE THIS WITH YOUR ACTUAL AGORA PRIMARY CERTIFICATE FROM AGORA CONSOLE
const AGORA_APP_CERTIFICATE = "YOUR_AGORA_PRIMARY_CERTIFICATE"; 

// Endpoint to generate dynamic RTC Tokens
app.get("/generateAgoraToken", (req, res) => {
    const channelName = req.query.channelName;

    // Validate request parameter
    if (!channelName) {
        return res.status(400).json({ error: "channelName query parameter is required" });
    }

    // Role configuration (PUBLISHER allows sending video/audio)
    const role = RtcRole.PUBLISHER;
    
    // Default UID set to 0 allows any joining device to be assigned a random numeric UID by Agora
    const uid = 0; 
    
    // Token validity duration set to 24 hours (86,400 seconds)
    const expirationTimeInSeconds = 3600 * 24;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

    try {
        // Build the token using Agora's SDK logic
        const token = RtcTokenBuilder.buildTokenWithUid(
            AGORA_APP_ID,
            AGORA_APP_CERTIFICATE,
            channelName,
            uid,
            role,
            privilegeExpiredTs
        );

        return res.status(200).json({ token: token });
    } catch (error) {
        console.error("Token generation failed:", error);
        return res.status(500).json({ error: "Failed to generate Agora token" });
    }
});

// Default route to check if server is running
app.get("/", (req, res) => {
    res.send("SkillShare Agora Token Server is up and running!");
});

// Use Render's assigned PORT or default to 3000 locally
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Token server running on port ${PORT}`);
});
