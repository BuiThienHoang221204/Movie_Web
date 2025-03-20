const { google } = require('googleapis');

const connectGoogleDrive = () => {
    const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.REDIRECT_URI
    );
    oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_DRIVE_REFESH_TOKEN });
    return google.drive({ version: 'v3', auth: oauth2Client });
}

module.exports = { connectGoogleDrive };