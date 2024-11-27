const express = require('express');
const router = express.Router();

router.get('/health', (req, res)=> {
  res.status(200).send('App is running');
});

module.exports = router;