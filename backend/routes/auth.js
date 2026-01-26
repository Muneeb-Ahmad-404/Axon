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