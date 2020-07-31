const router = require('express').Router();
const Quote = require('../models/Quote');
const QuoteRate = require('../models/Quote_rate');
const Comment = require('../models/Comment');
const {quoteValidation, quoteRateValidation, commentValidation} = require('../validation');

router.get('/', async (req, res)=>{
    const RES_PER_PAGE = 15;
    if(!req.user) return;
    const page = req.query.page;
    const quotes = await Quote.find({})
        .skip((RES_PER_PAGE * page) - RES_PER_PAGE)
        .limit(RES_PER_PAGE)
        .sort({date: -1})
        .populate('creator')
        .exec();


    const quotes_with_rate = await Promise.all(
        quotes.map(async (q) =>{
            const altQ = q.toJSON()
            const rates = await QuoteRate.find({quote:q._id});
            return {...altQ, neg: rates.filter(r => r.mark === -1).length, pos: rates.filter(r => r.mark === 1).length}
        })
    );

    res.send(quotes_with_rate);
});

router.get('/:id', async (req, res)=>{
    if(!req.user) return;
    const withComments = req.query.withComments;
    const id = req.params.id;

    let quote = await Quote.findById(id)
    .populate('creator')
    .exec();

    const rates = await QuoteRate.find({quote:quote._id});
    let comments;

    if(withComments)
        comments = await Comment.find({quote:id}).populate('author').sort({date: -1}).exec();

    quote = {...quote.toJSON(), neg: rates.filter(r => r.mark === -1).length, pos: rates.filter(r => r.mark === 1).length, comments}

    res.send(quote);
});

router.post('/:id/rate', async (req, res)=>{
    const {error} = quoteRateValidation(req.body);
    if(error)
        res.status(400).send(error.details[0]);
    else{
        const quoteId = req.params.id;

        let rating = await QuoteRate.findOne({quote: quoteId, rater: req.user._id}).exec();
        let previous_rate;

        if(!rating)
            rating = new QuoteRate({
                quote: quoteId,
                rater: req.user._id,
                mark: req.body.mark ? 1 : -1
            });
        else{
            previous_rate = rating.mark;
            rating.mark = req.body.mark ? 1 : -1
        }
        
        try {
            const savedQuoteRate = await (await rating.save()).toJSON();
            res.send({previous_rate, ...savedQuoteRate});
        } catch (error) {
            res.status(400).send(error);
        }
    }
});

router.post('/:id/comment', async (req, res)=>{
    const {error} = commentValidation(req.body);
    if(error)
        res.status(400).send(error.details[0]);
    else{
        const quoteId = req.params.id;

        const newComment = new Comment({
            content: req.body.content,
            author: req.user._id,
            quote: quoteId
        });

        try {
            const savedComment = await newComment.save();
            res.send(await savedComment.populate('author').execPopulate());
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