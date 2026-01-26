import express from "express";
import "dotenv/config";
import authRouter from './routes/auth.js';
import session from 'express-session';

const app = express();
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true },
    maxAge: 5 * 60 * 1000 // 5 minutes

}));

const PORT = process.env.PORT;

app.use('/auth', authRouter);


app.listen(PORT, () => {
    console.log(`listening at port ${PORT}`)
});
