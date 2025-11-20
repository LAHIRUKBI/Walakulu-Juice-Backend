const express = require('express');
const router = express.Router();


// Import subscription routes
router.use('/', require('./subscriptionRoutes'));


module.exports = router;