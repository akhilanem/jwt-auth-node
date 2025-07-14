const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const users = require('./users');
const authMiddleware = require('./authMiddleware');
require('dotenv').config();

console.log("SECRET_KEY:", process.env.SECRET_KEY); 

const SECRET_KEY = process.env.SECRET_KEY;

const app = express();
app.use(express.json());  

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

    const token = jwt.sign({id: user.id, role: user.role}, SECRET_KEY, {expiresIn: '1h'});
    res.json({token});
})

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

