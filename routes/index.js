const express = require('express');
const router = express.Router();

const storeController = require('../controllers/storeController');

// Do work here
router.get('/', storeController.homePage);

module.exports = router;

// mongodb + srv:jalajIsTheAdmin:xpzZwP0JeQkCuYK1@db-jalaj-1-vxvp0.mongodb.net/test?w=majority
