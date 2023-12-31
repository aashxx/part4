const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogsRouter = require('./controllers/blogs');
const logger = require('./utils/logger');
const mongoose = require('mongoose');

mongoose.connect(config.MONGO_URI).then(()=>{
    logger.info('Mongo Connected !');
}).catch(err => {
    logger.error(err);
});

app.use(cors());
app.use(express.json());

app.use('/api/blogs', blogsRouter);

module.exports = app;