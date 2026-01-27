import axios from 'axios'
import crypto from 'crypto';
import "dotenv/config";

export function initiateLinkedinAuth(req, res){
    const state = crypto.randomBytes(32).toString('hex');

    req.session.oauthState = state;

    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&state=${state}&scope=openid%20profile%20email%20w_member_social`;

    res.redirect(linkedinAuthUrl);
}

export function verifyLinkedinState(req, res, next){
    const {state: returnedState} = req.query;
    const {oauthState} = req.session;

    if(!returnedState || returnedState !== oauthState){
        return res.status(403).send({
            "title": "Security Violation",
            "message": "The state returned by LinkedIn does not match the one stored in session"
        });
    }

    req.session.cookie.maxAge = 7* 24* 60 * 60 * 1000; //extend session for 7 days
    delete req.session.oauthState;
    next();
}

export async function handleLinkedinCallback(authCode){
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
