const express = require('express');
const router = express.Router();

const adminController = require('../controllers/admin');

router.get('/dashboard', adminController.getDashboard);
router.get('/latest-transactions', adminController.getLatestTransactions);

router.get('/hotels', adminController.getHotels);
router.get('/edit-hotel/:id', adminController.getEditHotel);
router.put('/edit-hotel/:id', adminController.editHotel);
router.post('/add-hotel', adminController.addHotel);
router.delete('/delete-hotel/:id', adminController.deleteHotel);

router.get('/rooms', adminController.getRooms);
router.get('/edit-room/:id', adminController.getEditRoom);
router.put('/edit-room/:id', adminController.editRoom);
router.post('/add-room', adminController.addRoom);
router.delete('/delete-room/:id', adminController.deleteRoom);

router.get('/transactions', adminController.getTransactions);
module.exports = router;