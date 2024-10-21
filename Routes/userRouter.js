const express = require('express');
const router = express.Router();
const authController = require('./../Controller/authController')
const userController = require('./../Controller/userController')

router.route('/updatePassword/').patch(authController.protect,userController.updatePassword);

module.exports = router;