const express = require('express');
const router = express.Router();

const arduino = require('./arduino');

router.use('/arduino', arduino);

module.exports = router;