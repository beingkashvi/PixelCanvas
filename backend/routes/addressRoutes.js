const express = require('express');
const router = express.Router();
const {
  getSavedAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
} = require('../controllers/addressController');
const requireAuth = require('../middleware/authMiddleware');

// All routes require authentication
router.get('/', requireAuth, getSavedAddresses);
router.post('/', requireAuth, addAddress);
router.delete('/:addressId', requireAuth, deleteAddress);
router.put('/:addressId', requireAuth, updateAddress);

module.exports = router;