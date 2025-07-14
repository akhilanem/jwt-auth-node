const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./users');
const authMiddleware = require('./authMiddleware');
const logMiddleware = require("./logMiddleware");
require('dotenv').config();

console.log("SECRET_KEY:", process.env.SECRET_KEY); 

const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

let refreshTokens = []; // Store refresh tokens in memory (for demo purposes, use a database in production)


const generateAccessToken = (user) => {
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1m' });
};

const generateRefreshToken = (user) => {
    const refreshToken = jwt.sign({ id: user.id, role: user.role }, REFRESH_TOKEN, { expiresIn: '7d' });
    refreshTokens.push(refreshToken); // Store the refresh token
    return refreshToken;
};

const app = express();
app.use(express.json());  
app.use(logMiddleware);

app.post("/login",(req,res) => {
    const {username,password} = req.body;
    const user = users.find(u => u.username === username);

    if(!user){
        return res.status(404).send("User not found");
    }

    const isPasswordValid = bcrypt.compareSync(password,user.password);

    if(!isPasswordValid){
        return res.status(401).send("Invalid Password");
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    res.json({
        accessToken,
        refreshToken
    });
});

app.post("/refreshtoken", (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken || !refreshTokens.includes(refreshToken)) {
        return res.status(403).send("Refresh Token is not valid");
    }
    try{
        const userData = jwt.verify(refreshToken, REFRESH_TOKEN);
        if (!userData) {
            return res.status(403).send("Invalid Refresh Token");
        }
        const newAccessToken = generateAccessToken(userData);
        return res.json({
            accessToken: newAccessToken
        });
    }
    catch(err){
        return res.status(403).send("Refresh token expired or invalid")
    }
    
}); 

app.get("/admin", authMiddleware(SECRET_KEY,"admin"),(req,res) => {
    res.send("Welcome Admin! You have access.");
})

app.get("/user", authMiddleware(SECRET_KEY,"user"),(req,res) => {
    res.send("Welcome User! You have access.");  
})                   

app.get("/", (req, res) => {
    res.send("Welcome to the JWT Authentication Example");
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

