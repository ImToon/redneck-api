const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerValidation, loginValidation } = require('../validation');

router.post(`/register`, async (req,res)=>{

    const {error} = registerValidation(req.body);
    if(error)
        return res.status(400).send({error : error.details[0]});

    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist)
        return res.status(400).send({error : 'Email already used'});

    const usernameExist = await User.findOne({username:req.body.username});
    if(usernameExist)
        return res.status(400).send({error : 'Email already used'});

    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(req.body.password, salt);

    const newUser = new User({
        username: req.body.username,
        password: hash,
        email: req.body.email
    });
    try {
        const savedUser = await newUser.save();
        res.send(savedUser);
    } catch (err) {
        res.status(400).send({error : err});
    }
});

router.post(`/login`, async (req,res)=>{
    const {error} = loginValidation(req.body);
    if(error)
        return res.status(400).send({error: error.details[0]});

    const userFound = await User.findOne({username:req.body.username});
    if(!userFound)
        return res.status(404).send({error:'Username not found'});
    
    const isPasswordCorrect = await bcrypt.compare(req.body.password, userFound.password);
    if(isPasswordCorrect){
        const token = jwt.sign({_id : userFound._id}, process.env.TOKEN_SECRET);
        res.send({token : token});
    }   
    else
        return res.status(401).send({error : 'Username or password is wrong'});
});

module.exports = router;