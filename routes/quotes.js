const router = require('express').Router();
const {isTokenCorrect} = require('./verifyToken');
const Quote = require('../models/Quote');
const {quoteValidation} = require('../validation');

router.get('/:id', async (req, res)=>{
    await isTokenCorrect(req, res);
    if(!req.user) return;
    const id = req.params.id;
    if(req.user._id === id){
        Quote.find()
        .where({creator: id})
        .populate('creator')
        .exec()
        .then(content => res.send(content))
    }
    else
        res.status(403).send('Not allowed');
});

router.post('/:id', async(req, res)=>{
    await isTokenCorrect(req, res);
    if(!req.user) return;
    
    const id = req.params.id;
    if(req.user._id === id){
        const {error} = quoteValidation(req.body);
        if(error)
            res.status(400).send(error.details[0]);
        else{
            const newQuote = new Quote({
                creator: req.body.creator,
                content: req.body.content
            });
            try {
                const savedQuote = await newQuote.save();
                res.send(savedQuote);
            } catch (error) {
                res.status(400).send(error);
            }
        }
    }

    

    
})

module.exports = router;