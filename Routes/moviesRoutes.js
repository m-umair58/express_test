const express = require('express');
const router = express.Router();
const moviesController = require('./../Controller/moviesController')
const authController = require('./../Controller/authController')

// this is another way to define routes
router.route('/get-highest').get(moviesController.getHighestRated,moviesController.getAllMovies)
router.route('/')
    .get(moviesController.getAllMovies)
    .post(moviesController.createMovie)

router.route('/:id')
    .get(moviesController.getMovieById)
    .patch(moviesController.updateMovie)
    .delete(authController.protect,authController.restrict("admin"),moviesController.deleteMovieById)

module.exports = router;