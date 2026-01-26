import express from "express";
import "dotenv/config";
import {handleLinkedinCallback, initiateLinkedinAuth, verifyLinkedinState} from "../controllers/auth.js";

const router = express.Router();


//LINKEDIN
//OAUTH 2.0

//get code...
router.get(`/linkedin`, initiateLinkedinAuth);

//callback -- get access token
router.get("/linkedin/callback", verifyLinkedinState, async (req, res) => {
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