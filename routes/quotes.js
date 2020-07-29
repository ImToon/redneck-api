const router = require('express').Router();
const Quote = require('../models/Quote');
const QuoteRate = require('../models/Quote_rate');
const {quoteValidation, quoteRateValidation} = require('../validation');

router.get('/', async (req, res)=>{
    const RES_PER_PAGE = 10;
    if(!req.user) return;
    const page = req.query.page;
    const quotes = await Quote.find({})
        .skip((RES_PER_PAGE * page) - RES_PER_PAGE)
        .limit(RES_PER_PAGE)
        .sort({date: -1})
        .populate('creator')
        .exec();
    res.send(quotes);
});

router.get('/:id', async (req, res)=>{
    if(!req.user) return;
    const id = req.params.id;
    const quote = await Quote.findById(id)
    .populate('creator')
    .exec();
    res.send(quote);
});

router.post('/:id/rate', async (req, res)=>{
    const {error} = quoteRateValidation(req.body);
    if(error)
        res.status(400).send(error.details[0]);
    else{
        const quoteId = req.params.id;
        const newQuoteRate = new QuoteRate({
            quote: quoteId,
            rater: req.user._id,
            mark: req.body.mark
        });
        try {
            const savedQuoteRate = await newQuoteRate.save();
            res.send(savedQuoteRate);
        } catch (error) {
            res.status(400).send(error);
        }
    }
});

router.post('/', async(req, res)=>{
    if(!req.user) return;
    
    const {error} = quoteValidation(req.body);
    if(error)
        res.status(400).send(error.details[0]);
    else{
        const newQuote = new Quote({
            creator: req.user._id,
            content: req.body.content
        });
        try {
            const savedQuote = await newQuote.save();
            res.send(savedQuote);
        } catch (error) {
            res.status(400).send(error);
        }
    }
})

module.exports = router;