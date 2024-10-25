const express = require('express');
const router = express.Router();

const songsController = require('./../Controller/songController')
const authController = require('./../Controller/authController')

// this is another way to define routes
// router.route('/get-highest').get(songsController.getHighestRated,songsController.getAllSongs)
router.route('/')
    .get(songsController.getAllSongs)
    .post(songsController.createSong)

router.route('/:id')
    .get(authController.protect,songsController.getSongById)
    .patch(songsController.updateSong)
    .delete(authController.protect,authController.restrict("admin"),songsController.deleteSongById)

module.exports = router;
