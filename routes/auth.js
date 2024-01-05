const express = require('express');
const router = express.Router();
const { register, login, deleteUser } = require('../controllers/auth');

router.route('/register').post(register);
router.route('/login').post(login);
router.route('/user/:email').delete(deleteUser);

module.exports = router;