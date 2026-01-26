import express from "express";
import "dotenv/config";
import {handleLinkedinCallback} from "../controllers/auth.js";

const router = express.Router();
//LINKEDIN
//OAUTH 2.0

//get code...
router.get(`/linkedin`, (req, res) => {
    try{
        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&state=foobar&scope=openid%20profile%20email%20w_member_social`;
        
        res.redirect(linkedinAuthUrl);
    }
    catch(error){
        return res.send({
            "title": "error",
            "message": error.message
        });
    };
})


//callback -- get access token
router.get("/linkedin/callback", async (req, res) => {
    const {code: authCode} = req.query;

    if(!authCode){
        return res.status(400).send({
            "title": req.query.error || "no_code",
            "message": req.query.error_description || "No code received"
        });
    }

    try{
        const response = await handleLinkedinCallback(authCode);

        // Store access token in an HTTP-only, secure cookie instead of exposing it in the response body
        res.cookie("linkedin_access_token", response.data.access_token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 1000 // 1 hour
        });

        return res.send({
            message: "Success"
        });
    }
    catch (error) {
        // Log detailed error information server-side for debugging/monitoring
        console.error("LinkedIn callback error:", {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message,
        });

        // Return a generic error message to the client without exposing LinkedIn's response payload
        return res.status(error.response?.status || 500).send({
            title: "Exchange Failed",
            message: "An error occurred while exchanging the authorization code. Please try again later.",
        });
    }
});


export default router;