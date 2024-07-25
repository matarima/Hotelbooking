const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');


router.post('/transaction', transactionController.createTransaction);
router.get('/transaction/:userId', transactionController.getTransactionsByUserId );
router.get('/transaction/:username', transactionController.getTransactionsByUsername);

module.exports = router;