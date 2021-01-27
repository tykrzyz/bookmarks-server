/* eslint-disable eqeqeq */
const express = require('express');
const { v4: uuid } = require('uuid');
const logger = require('../logger');
const bookmarks = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
  .route('/bookmarks')
  .get((req, res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req, res) => {
    const { title, url, rating } = req.body;
    if (!title) {
      logger.error('Title is required');
      return res
        .status(400)
        .send('Invalid data');
    }
        
    if (!url) {
      logger.error('URL is required');
      return res
        .status(400)
        .send('Invalid data');
    }

    if (!rating) {
      logger.error('Rating is required');
      return res
        .status(400)
        .send('Invalid data');
    }
      
    const id = uuid();
      
    const bookmark = {
      id,
      title,
      url,
      rating
    };
      
    bookmarks.push(bookmark);
    logger.info(`bookmark with id ${id} created`);
      
    res
      .status(201)
      .location(`http://localhost:8000/bookmark/${id}`)
      .json(bookmark);
  });

bookmarksRouter
  .route('/bookmarks/:id')
  .get((req, res) => {
    const { id } = req.params;
    const bookmark = bookmarks.find(b => b.id == id);

    if (!bookmark) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('bookmark Not Found');
    }

    res.json(bookmark);
  })
  .delete((req, res) => {
    const { id } = req.params;

    const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

    if (bookmarkIndex === -1) {
      logger.error(`bookmark with id ${id} not found.`);
      return res
        .status(404)
        .send('Not found');
    }

    bookmarks.splice(bookmarkIndex, 1);

    logger.info(`bookmark with id ${id} deleted.`);

    res
      .status(204)
      .end();
  });


module.exports = bookmarksRouter;