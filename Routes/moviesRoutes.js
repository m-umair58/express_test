const express = require('express');
const router = express.Router();
const moviesController = require('./../Controller/moviesController')

router.param('id',moviesController.checkId);
// this is another way to define routes
router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.validateBody,moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovieById)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovieById)

module.exports = router;