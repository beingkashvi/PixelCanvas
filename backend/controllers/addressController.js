const User = require('../models/userModel');

// Get all saved addresses for user
const getSavedAddresses = async (req, res) => {
  try {
    const userId = req.user;
    
    const user = await User.findById(userId).select('savedAddresses');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(200).json(user.savedAddresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add new address
const addAddress = async (req, res) => {
  try {
    const userId = req.user;
    const { fullName, addressLine1, addressLine2, city, state, zipCode, phone } = req.body;
    
    // Validate required fields
    if (!fullName || !addressLine1 || !city || !state || !zipCode || !phone) {
      return res.status(400).json({ error: 'All required fields must be filled' });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create new address object
    const newAddress = {
      fullName,
      addressLine1,
      addressLine2: addressLine2 || '',
      city,
      state,
      zipCode,
      phone,
      country: 'India',
    };

    // Add to user's savedAddresses
    user.savedAddresses.push(newAddress);
    await user.save();

    res.status(201).json({
      message: 'Address added successfully',
      address: user.savedAddresses[user.savedAddresses.length - 1],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete address
const deleteAddress = async (req, res) => {
  try {
    const userId = req.user;
    const { addressId } = req.params;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find and remove address
    user.savedAddresses = user.savedAddresses.filter(
      addr => addr._id.toString() !== addressId
    );
    
    await user.save();

    res.status(200).json({ message: 'Address deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update address
const updateAddress = async (req, res) => {
  try {
    const userId = req.user;
    const { addressId } = req.params;
    const { fullName, addressLine1, addressLine2, city, state, zipCode, phone } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const addressIndex = user.savedAddresses.findIndex(
      addr => addr._id.toString() === addressId
    );

    if (addressIndex === -1) {
      return res.status(404).json({ error: 'Address not found' });
    }

    // Update address fields
    if (fullName) user.savedAddresses[addressIndex].fullName = fullName;
    if (addressLine1) user.savedAddresses[addressIndex].addressLine1 = addressLine1;
    if (addressLine2) user.savedAddresses[addressIndex].addressLine2 = addressLine2;
    if (city) user.savedAddresses[addressIndex].city = city;
    if (state) user.savedAddresses[addressIndex].state = state;
    if (zipCode) user.savedAddresses[addressIndex].zipCode = zipCode;
    if (phone) user.savedAddresses[addressIndex].phone = phone;

    await user.save();

    res.status(200).json({
      message: 'Address updated successfully',
      address: user.savedAddresses[addressIndex],
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSavedAddresses,
  addAddress,
  deleteAddress,
  updateAddress,
};