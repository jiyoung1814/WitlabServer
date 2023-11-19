const express = require('express');
const router = express.Router();

const hamamtusController = require('../controllers/hamamtus');

//hamamtus
router.route('/hamamauts/meserment').post(hamamtusController.getMeasurement);


module.exports = router;