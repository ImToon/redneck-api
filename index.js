const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const quotesRoute = require('./routes/quotes');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNECT,
    { useNewUrlParser: true},
    ()=>console.log('Connected to db !')
);

app.use(express.json());

app.use('/api/user', authRoute);
app.use('/api/quotes', quotesRoute);

app.listen(3000, ()=>console.log("Connected"));