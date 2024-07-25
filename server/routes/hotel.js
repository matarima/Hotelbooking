const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotel');

router.get('/homepage', hotelController.getHomepageData);
router.get('/search', hotelController.searchHotels);
router.get('/hotel/:id', hotelController.getHotelById); // Thêm route mới để lấy thông tin khách sạn theo ID



module.exports = router;