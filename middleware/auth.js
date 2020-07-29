const jwt = require('jsonwebtoken');
const { verify } = require('crypto');

const PUBLIC_ENDPOINTS = [
    '/api/users/register', 
    '/api/users/login'
]

const isTokenCorrect = async (req, res, next)=>{
    const token = req.headers.authorization;
    if(!token)
        res.status(401).send('Token is missing');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};


module.exports = async (req, res, next)=>{
    if(PUBLIC_ENDPOINTS.includes(req.url))
        next();
    else{
        await isTokenCorrect(req, res);
        next();
    }
}