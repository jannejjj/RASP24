var express = require('express');
var router = express.Router();
// const controller = require("./controller");
const {body, validationResult } = require("express-validator");
const Member = require("../models/member");
const Member_event = require("../models/member_event");
const Event = require("../models/event");
const Member_Event = require("../models/member_event");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const multer = require("multer");
const member_event = require('../models/member_event');
const storage = multer.memoryStorage();
const upload = multer({storage});
var idFromToken = null;


require('../auth/passport')(passport)
router.use(passport.initialize());

//finds all the members in the DB if authenticated
router.get("/members/", passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
      const members  = await Member.find({}).select("-password").sort({firstname: 1, lastname: 1});
      res.send(members);
    } catch (err) {
      console.error('Error fetching member data:', err);
      res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get("/events",passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
      const events  = await Event.find({});
      res.send(events);
  } catch (err) {
      console.error(err);
      res.send("No events.");
  }
});

router.post('/login',
  upload.none(),
  body("email").trim().escape(),
  body("password"),
  async (req, res) => {
    //checks if user exists with email
    try {
        const member = await Member.findOne({email: req.body.email});
        if(!member){
            return res.send({success: false, message: "Invalid credentials"});
        } else {
            //compares crypted password
            bcrypt.compare(req.body.password, member.password, (err, isMatch) => {
                if(err) throw err;
                if(isMatch) {
                //creates JWT
                const jwtPayload = {
                    id: member._id,
                    firstname: member.firstname,
                    lastname: member.lastname,
                    email: member.email,
                    admin: member.admin
                }
                jwt.sign(
                    jwtPayload,
                    process.env.SECRET,
                    {
                    expiresIn: '24h' //expires on 24 hours and log in is needed again.
                    },
                    (err, token) => {
                      res.json({success: true, token, admin: member.admin, id: member._id, firstname: member.firstname, lastname: member.lastname});
                    }
                );
                } else {
                    return res.status(403).json({success: false, message: "Invalid credentials"});
                }
            })
        }
    } catch(err) {
        throw err;
    }
});

function getIdfromToken(token){
    const decodedToken = jwt.verify(token, process.env.SECRET);
    return decodedToken.id;
}

router.get("/getID", async(req,res)=>{
    res.json(idFromToken);
});

// Register new member
router.post('/register', 
  //checks that email is correct format
  body("email").trim().isEmail().escape(),
  //checks that password meets the requirements (express-authenticator)
  body("password").isStrongPassword().withMessage('Password is not strong enough'),
 async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
         console.log("Errors");
      return res.status(400).json({success: false, errors: errors.array()});
      
    }
    //checks if email is already in use
    try {
        const duplicate = await Member.findOne({email: req.body.email});
        if(duplicate){
            return res.status(403).json({success: false, message: "Email already in use"});
        } else {
        //if member doesn't exist creates new member
        //creates password hash and salts it
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if(err) throw err;
                const member = new Member({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        phone: req.body.phone,
                        address: req.body.address,
                        postalcode: req.body.postalcode,
                        city: req.body.city,
                        country: req.body.country,
                        email: req.body.email,
                        password: hash,
                        role: "",
                        membershipPaid: false,
                        membershipPaidDate: null,
                        admin: 0
                    });
                    member.save()
                        .then(result => {
                            console.log(result);
                            return res.json({success: true, message: "New user registered."});
                        })
                        .catch(err => {
                            console.error(err); 
                    })
            });
        });
        }
    } catch(err) {
        console.log(err);
    }
      
});

// Update the role and admin permissions for the member
router.put('/update/member/', passport.authenticate('jwt', {session: false}), async (req, res) =>
{
    const newRole = req.body.role;
    const newPermission = req.body.permission;
    const memberID = req.body.memberID;

    const updatedMember = await Member.findOneAndUpdate({_id: memberID}, {role: newRole, admin: newPermission});

    if (updatedMember)
    {
        return res.json({success: true});
    }
    else
    {
        return res.json({success: false});
    }
});

// Delete the member
router.delete('/delete/member/:memberID', passport.authenticate('jwt', {session: false}), async (req, res) =>
{
    const memberID = req.params.memberID;

    const deletedMember = await Member.findOneAndDelete({_id: memberID});

    if (deletedMember)
    {
        return res.json({success: true});
    }
    else
    {
        return res.json({success: false});
    }
});


router.get('/get/events/for/:id', async (req, res) =>
{
    const id = req.params.id;
    // Initialize the lists where the events will be added
    let events = [];
    let eventIDs = [];

    // Find the IDs of the events that the user is participating in
    await Member_event.find({member: id})
    .then((docs) =>
    {
        docs.forEach(item => {
            eventIDs.push(item.event);
        });
    });

    // Find the events using the IDs and add to list
    await Event.find({_id: {$in: eventIDs}})
    .then((docs) => {
      docs.forEach(event => {
        events.push(event);
      });
    });

    // Returns a list every time. If the user is not partisipating in any events, the list is empty.
    return res.json({events});
});

router.post('/event', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const event = new Event({
      title: req.body.title,
      creator: req.body.creator,
      creatorId: req.body.creatorId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      location: req.body.location,
      description: req.body.description,
      attendees: req.body.attendees,
      tickets: req.body.tickets,
      ticketsSold: 0,
      joinDeadline: req.body.joinDeadline,
      price: req.body.price
  });
  event.save()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
  });

  // Add the creator as an attendee in the back-end
  const member_event = new Member_Event({
    date: new Date(),
    paid: false,
    member: req.body.creatorId,
    event: event._id
  });
  member_event.save()
    .catch(err => {
      console.log(err);
  });
});

router.delete('/event/:id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
      await Event.findByIdAndDelete(req.params.id);
      await Member_Event.deleteMany({event: req.params.id});
      res.status(200).json({ message: "Event deleted." });
  } catch (err) {
      res.status(500).json({error: "Error deleting event."});
  }
});

// Add the user as an attendee to a specific event
router.post('/attend/event', passport.authenticate('jwt', {session: false}), async (req, res) =>
{
    const eventID = req.body.eventID;
    const userID = req.body.userID;
    let succesful = true;

    const member_event = new Member_Event(
        {
            date: new Date(),
            paid: false,
            member: userID,
            event: eventID
        }
    );

    member_event.save()    
    .catch(err => 
        {
            console.log("Error while attending: " + err);
            succesful = false;
            return res.json({success: false});
        }
    );

    if (succesful)
    {
        // After the attendance has been succesful, increase the amount of attendees for the event.
        Event.findByIdAndUpdate({_id: eventID}, { $inc: {attendees: 1} })
        .catch(err =>
            {
                if (err)
                {
                    console.log(err);
                }
            })

        return res.json({success: true});
    }
});

// Cancel the attendance to an event
router.delete('/cancel/attendance/:eventID/:userID', passport.authenticate('jwt', {session: false}), async (req, res) =>
{
    const eventID = req.params.eventID;
    const userID = req.params.userID;

    try
    {
        const deletedItem = await Member_Event.findOneAndDelete({member: userID, event: eventID});

        if (deletedItem)
        {
            try
            {
                // Update the amount of attendees the event now has
                const updatedItem = await Event.findByIdAndUpdate({_id: eventID}, { $inc: {attendees: -1} })
                
                if (updatedItem)
                {
                    return res.json({success: true});
                }
                else
                {
                    return res.json({success: false});
                }
            }
            catch (error)
            {
                console.log("Error while updating the attendees of the event: " + error);
                return res.json({success: false});
            }
        }
        else
        {
            return res.json({success: false});
        }
    }
    catch (error)
    {
        console.log("Error while cancelling the attendance: " + error);
        return res.json({success: false});
    }
})

// Confirm if a user is attending an event or not
router.get('/is/attending/:eventID/:userID', async (req, res) =>
{
    const eventID = req.params.eventID;
    const userID = req.params.userID;

    await Member_event.find({event: eventID, member: userID})
    .then((docs) =>
    {
        if (docs.length > 0)
        {
            return res.json({attending: true});
        }
        else
        {
            return res.json({attending: false});
        }
    });
})

router.post('/authenticate/token', (req, res) =>
{
    try
    {
        const payload = jwt.verify(req.body.token, process.env.SECRET);

        if (payload)
        {
            return res.json({success: true, admin: payload.admin, id: payload.id, firstname: payload.firstname, lastname: payload.lastname});
        }
        else
        {
            return res.json({success: false});
        }
    }
    catch (exception)
    {
        return res.json({success: false});
    }
})

module.exports = router;