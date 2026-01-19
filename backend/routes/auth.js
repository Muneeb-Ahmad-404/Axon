import express from "express";
import "dotenv/config";
import {handleLinkedinCallback} from "../controllers/auth.js";

const router = express.Router();
//LINKEDIN
//OAUTH 2.0

//get code...
router.get(`/linkedin`, (req, res) => {
    try{
        const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&state=foobar&scope=openid%20profile%20email`;
        
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

        return res.send({
            message: "Success",
            access_token: response.data.access_token
        });
    }
    catch (error) {
        return res.status(error.response?.status || 500).send({
            "title": "Exchange Failed",
            "details": error.response?.data
        });
    }
});


export default router;