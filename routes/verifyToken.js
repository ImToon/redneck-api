const jwt = require('jsonwebtoken');

const isTokenCorrect = async (req, res, next)=>{
    const token = req.header('Authorization');
    if(!token)
        return res.status(401).send('Token is missing');

    try {
        const verified = await jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
    } catch (error) {
        res.status(400).send('Invalid token');
    }
};

exports.isTokenCorrect = isTokenCorrect;