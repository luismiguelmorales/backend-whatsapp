const express = require('express');

const messageController = require('../controllers/messages');

const router = express.Router();

router.post('/messages', messageController.getMessages);

router.post('/singlemessage', messageController.postAddMessage);

module.exports = router;
