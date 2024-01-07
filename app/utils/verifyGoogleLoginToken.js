import CONFIG from "./config.js";
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client();
const clientid = CONFIG.CLIENT_ID;
async function verifyGoogleLoginToken(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: clientid
    });
    const payload = ticket.getPayload();
    return payload;
}

export default verifyGoogleLoginToken;