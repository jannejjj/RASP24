var express = require('express');
var router = express.Router();
const multer = require('multer');
const Member = require("../models/member");
const Image = require("../models/image");

const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage });

const jwt = require("jsonwebtoken");
const passport = require('passport');

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

router.get('/getImage/:userId', upload.single('image'), async (req, res) => {
  try{
    const id   = req.params.userId;
    if (!id) {
      return res.status(400).json({ error: 'id parameter is required' });
    }
    const userData = await Member.findById(id);
    if (!userData) {
      return res.status(405).json({ error: 'User not found' });
    }
    const imageId = userData.profileImage;
    if(imageId!= null){
      const imageData = await Image.findById(imageId);
      res.json(imageData);
    }else{
      return res.status(404).json({error: "the user doesn't have a profile picture"});
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/updateImage/:userId', upload.single('image'), async (req, res) => {
  try {
    const userId = req.params.userId;
    const file = req.file;
    const user = await Member.findById(userId);
    const maxSize = 2;
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    if(!file){
      return res.status(409).json({error: "there is no image"})
    }
    const fileSize= file.size / (1024 * 1024); //size in megabytes
    if(fileSize > maxSize){
      return res.status(413).json({error: "the image size is to big"});
    }
    if(user.profileImage != null){
      await Image.findByIdAndDelete(user.profileImage);
    }
    const newImage = new Image({
      buffer: file.buffer,
      mimetype: file.mimetype,
      name: file.originalname,
      encoding: 'base64'
    });
  
    const savedImage = await newImage.save();

    user.profileImage = savedImage._id;
    await user.save();

    res.status(201).json(savedImage);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upload image', error: error.message });
  }
});


// Handle POST request to update user profile
router.post('/updateProfile', passport.authenticate('jwt', {session: false}), async (req, res) => {
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

    // Update the JWT
    const jwtPayload = {
      id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: updatedProfileData.email,
      admin: user.admin
    };
    jwt.sign(
      jwtPayload,
      process.env.SECRET,
      {
      expiresIn: '24h' //expires on 24 hours and log in is needed again.
      },
      (err, token) => {
        if (token)
        {
          return res.json({success: true, token, admin: user.admin, id: user._id, firstname: user.firstname, lastname: user.lastname});
        }
        else if (err)
        {
          console.log("Error while editing member data\n" + err);
          return res.json({success: false});
        }
      }
    );
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
