import axios from 'axios'
import "dotenv/config";

export default async function handleLinkedinCallback(authCode){
    const response = await axios({
        method: 'post',
        url: 'https://www.linkedin.com/oauth/v2/accessToken',
        data: new URLSearchParams({
            grant_type: 'authorization_code',
            code: authCode,
            client_id: process.env.LINKEDIN_CLIENT_ID,
            client_secret: process.env.LINKEDIN_CLIENT_SECRET,
            redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        }).toString(),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return response;
}
