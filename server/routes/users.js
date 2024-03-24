var express = require('express');
var router = express.Router();
const Member = require("../models/member");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//get to have the members data
router.get('/getData/:userId', async (req, res) => {
  try {
    const id = req.params.userId;
    if (!id) {
      return res.status(400).json({ error: 'Name parameter is required' });
    }
    if (id == "0") {
      return res.status(400).json({ error: 'Name parameter is required' });
    }
    const userData = await Member.findById(id);
    if (!userData) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Handle POST request to update user profile
router.post('/updateProfile', async (req, res) => {
  try {
    const userId = req.body._id;
    const updatedProfileData  = req.body.user;

    // Find the user by ID in the database
    const user = await Member.findById(userId);

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update the user's profile data
    user.phone = updatedProfileData.phone;
    user.address = updatedProfileData.address;
    user.postalcode = updatedProfileData.postalcode;
    user.city = updatedProfileData.city;
    user.country = updatedProfileData.country;
    user.email = updatedProfileData.email;
  
    // Save the updated user object back to the database
    await user.save();

    res.status(200).send('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
