const express = require("express");
const http = require('http');
const app = express();
const cors = require("cors");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const mongoose = require("mongoose");

const authMiddleware = require("./middleware/auth");

const authRoute = require("./routes/auth");
const quotesRoute = require("./routes/quotes");

mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () =>
  console.log("Connected to db !")
);

app.use(cors());
app.use(express.json());
app.use(authMiddleware);
app.use("/api/users", authRoute);
app.use("/api/quotes", quotesRoute);

app.listen(PORT, () => console.log("Connected"));

setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);