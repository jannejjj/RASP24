var express = require('express');
var router = express.Router();
// const controller = require("./controller");
const {body, validationResult } = require("express-validator");
const Member = require("../models/member");
const Member_event = require("../models/member_event");
const Member_Event = require("../models/member_event");
const Event = require("../models/event");
const NewsPost = require("../models/newsPost");
const Ticket = require("../models/ticket");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require('passport');
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({storage});
const nodemailer = require('nodemailer');
const cron = require("node-cron");
const ticket = require('../models/ticket');
var idFromToken = null;


require('../auth/passport')(passport);
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

/* Finds all events */
router.get("/events",passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
      const events  = await Event.find({});
      res.send(events);
  } catch (err) {
      console.error(err);
      res.send("No events.");
  }
});

/* Finds all news */
router.get("/news",passport.authenticate('jwt', {session: false}), async (req, res) => {
  try {
      const news  = await NewsPost.find({});
      res.send(news);
  } catch (err) {
      console.error(err);
      res.send("No news.");
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
                };
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
                        membershipExpirationDate: null,
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

router.post('/pay/membership', async (req, res) => {
  try {
    const userId = req.body._id;
    const user = await Member.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    // Update the user's profile data
    user.membershipPaid = req.body.user.membershipPaid;
    user.membershipPaidDate = req.body.user.membershipPaidDate;
    user.membershipExpirationDate = req.body.user.membershipExpirationDate;
    await user.save();
    res.status(200).send('Profile updated successfully');
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send('Internal Server Error');
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

// Delete the news post
router.delete('/delete/post/:postID', passport.authenticate('jwt', {session: false}), async (req, res) =>
{
    const postID = req.params.postID;

    const deletedPost = await NewsPost.findOneAndDelete({_id: postID});

    if (deletedPost)
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

    // Find the IDs of the events that the user has liked
    await Member_event.find({member: id})
    .then((docs) =>
    {
        docs.forEach(item => {
            eventIDs.push(item.event);
        });
    });

    // Find the IDs of the events where the user has a ticket
    await Ticket.find({member: id})
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

    // Returns a list every time. If the user is not participating in any events, the list is empty.
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
    date: [new Date()],
    member: req.body.creatorId,
    event: event._id,
    tickets: 0
  });
  member_event.save()
    .catch(err => {
      console.log(err);
  });
});

/* Creates news post */
router.post('/news', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const newsPost = new NewsPost({
      title: req.body.title,
      creator: req.body.creator,
      creatorId: req.body.creatorId,
      text: req.body.text
  });
  newsPost.save()
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      console.log(err);
  });
});

router.post('/ticket',passport.authenticate('jwt', {session: false}), async (req, res)=>{
    try
    {
        const { userId, eventId } = req.body;

        let event = await Event.findById(eventId);
        const user = await Member.findById(userId);

        if(!event || !user){
            return res.status(404).json({ error: 'User or Event not found' });
    
        }
        const ticket = await Ticket.findOne({ // find if the user already has a ticket
            member: user._id,
            event: event._id
        });
        if(ticket){ // the user has already paid
            return res.status(409).json({ error: 'User already have a ticket' });   
        }
        if(event.tickets === event.ticketsSold){ // if the maximum number of tickets is the same as sold tickets - no tickets left
            return res.status(409).json({ error: 'There is no tickets left' }); 
        }

        // if nothing else has happened, a new ticket is created
        const new_ticket = new Ticket({
            date: new Date(),
            member: user._id,
            event: event._id,
            used: false
        });
        event.ticketsSold++;

        await new_ticket.save();
        await event.save();
        return res.json({
          ticket: new_ticket
        });
    }
    catch(err)
    {
        console.error('Error selling tickets:', err);
    }
});

router.post('/hasTicket',passport.authenticate('jwt', {session: false}), async (req, res)=>{
    try{
        const { userId, eventId } = req.body;

        const event = await Event.findById(eventId);
        const user = await Member.findById(userId);

        if(!event || !user){
            return res.status(404).json({ error: 'User or Event not found' });
        }
        const ticket = await Ticket.findOne({
            member: user._id,
            event: event._id
        });

        if(ticket){
            return res.json({
              hasTicket: true,
              ticket: ticket
            });
        }

        return res.json({hasTicket: false});
    }catch(err){
        console.error('Error while checking tickets:', err);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/checkticket',passport.authenticate('jwt', {session: false}), async (req, res)=>{
    try{
        const { userId, eventId } = req.body;

        const event = await Event.findById(eventId);
        const user = await Member.findById(userId);

        if(!event || !user){
            return res.status(404).json({ error: 'User or Event not found' });
    
        }

        const ticket = await Ticket.findOne({
            member: user._id,
            event: event._id
        });
        if(ticket){
            return res.json({hasTicket: true});
        }

        return res.json({hasTicket: false});
    }catch(err){
        console.error('Error while checking tickets:', err);
        return res.status(500).send('Internal Server Error');
    }
});

router.post('/ticket/use/:id',passport.authenticate('jwt', {session: false}), async (req, res)=>{
  try {
    const ticketId = req.params.id;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).send("Ticket not found.");
    } else if (ticket.used) {
      return res.status(409).send("Ticket already used.");
    } else {
      ticket.used = true;
      await ticket.save();
      return res.status(200).json({
        success: true,
        ticket: ticket
      })
    }
  } catch (err) {
    return res.status(500).send("Error using ticket.");
  }
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

router.post("/editEvent",passport.authenticate('jwt', {session: false}), async (req, res) => {
    try {
        const eventID = req.body.id;
        const editedEvent = req.body;

        const event = await Event.findById(eventID);

        if (!event) {
            return res.status(404).send('Event not found');
        }
        if(editedEvent.tickets < event.ticketsSold){
            return res.status(409).send("tickets should be more than the tickets already sold");
        }

        event.location = editedEvent.location;
        event.description = editedEvent.description;
        event.price = editedEvent.price;
        event.startDate = editedEvent.startDate;
        event.joinDeadline = editedEvent.joinDeadline;   
        event.endDate = editedEvent.endDate;
        event.tickets = editedEvent.tickets;       

        await event.save();
        res.status(200).json({"event": event})
    } catch (err) {
        console.error(err);
        res.json({success: false});
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

router.get('/event/participants/:id',passport.authenticate('jwt', {session: false}), async (req, res)=>{
    try{
        const eventId = req.params.id;

        const event = await Event.findById(eventId);

        if(!event){
            return res.status(409).json({ error: 'Event not found' });
        }
        const tickets = await Ticket.find({
            event: event._id
        });

        if (tickets.length > 0) {
            const participantsData = [];

            for (const ticket of tickets) { // Find user data and add it to "participantsData"
                const member = await Member.findById(ticket.member);

                if (member) {
                    participantsData.push({
                        member: {
                            email: member.email,
                            firstname: member.firstname,
                            lastname: member.lastname
                        },
                    });
                }
            }
            return res.json({ data: participantsData });
        }
        return res.json({data: null});
    }catch(err){
        console.error('Error while checking participants:', err);
        return res.status(500).send('Internal Server Error');
    }
});

// Send reminders about the event that will start in 24 hours. This function will run every hour
cron.schedule("0 0 * * * *", async () =>
{
    const sendReminders = async (emails, event) =>
    {
        const emails_string = convertEmailsToString(emails);

        const message = "Reminder about event: " + event.title + "\nEvent starts at: " + event.startDate;

        // Finally send the reminder about the event
        const transporter = nodemailer.createTransport(
            {
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth:
                {
                    user: "assocease@gmail.com",
                    // This password is an App Password that was created for this example email address.
                    // It can't be used to normally login to the gmail service.
                    pass: "izdn grhs ymwm lxmx"
                }
            }
        );
    
        const mailOptions = {
            from: "assocease@gmail.com",
            to: emails_string,
            subject: 'Event reminder from AssocEase',
            text: message
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }

    const fetchMemberData = async (memberIDs, event) =>
    {
        const emails = await Member.find({_id: { $in: memberIDs}}).select("email");

        sendReminders(emails, event);
    }

    const fetchTicketData = async (event) =>
    {
        const tickets = await Ticket.find({event: event._id});

        let memberIDs = [];

        tickets.forEach((ticket) =>
        {
            memberIDs.push(ticket.member);
        });

        fetchMemberData(memberIDs, event);
    }

    const fetchEventData = async () =>
    {
        const twentyThreeHoursFromNow = new Date();
        twentyThreeHoursFromNow.setHours(twentyThreeHoursFromNow.getHours() + 23);
    
        const twentyFourHoursFromNow = new Date();
        twentyFourHoursFromNow.setHours(twentyFourHoursFromNow.getHours() + 24);    

        // Get the events that will start in 24 hours. Because this function will run every hour, get every event that
        // starts in 23 - 24 hours.
        const events = await Event.find({startDate: {
            $gte: twentyThreeHoursFromNow,
            $lt: twentyFourHoursFromNow 
            }
        })

        events.forEach((event) =>
        {
            fetchTicketData(event);
        })
    }

    fetchEventData();
});

// Once a day check if there are members whose membership will be outdated in two weeks
// send them a two week notice. Also check if there are members whose membership will
// be outdated in a week send them a weeks notice.
cron.schedule('0 0 0 * * *', async () =>
{
    const twoWeeksFromNow = new Date();
    twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);

    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);

    // Find all the members whose membership expires in two weeks
    const members = await Member.find({});

    if (members)
    {
        let expiresInTwoWeeks = [];
        let expiresInOneWeek = [];
        let expirresToday = [];

        members.forEach((member) =>
        {
            if (member.membershipExpirationDate.getDate() == twoWeeksFromNow.getDate())
            {
                expiresInTwoWeeks.push(member.email);
            }
            else if (member.membershipExpirationDate.getDate() == weekFromNow.getDate())
            {
                expiresInOneWeek.push(member.email);
            }
            else if (member.membershipExpirationDate.getDate() == new Date().getDate())
            {
                expirresToday.push(member.email);
            }
        })

        await SendTwoWeeksNotice(expiresInTwoWeeks);
        await SendOneWeeksNotice(expiresInOneWeek);
        await SendExpirationNotice(expirresToday)
    }
});

const SendTwoWeeksNotice = async (emails) =>
{
    const emails_string = convertEmailsToString(emails);

    const message = "Your membersship to AssocEase will expire in two weeks!"

    // Finally send the reminder about the event
    const transporter = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:
            {
                user: "assocease@gmail.com",
                // This password is an App Password that was created for this example email address.
                // It can't be used to normally login to the gmail service.
                pass: "izdn grhs ymwm lxmx"
            }
        }
    );

    const mailOptions = {
        from: "assocease@gmail.com",
        to: emails_string,
        subject: 'AssocEase membership expiration notice',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}   

const SendOneWeeksNotice = async (emails) =>
{
    const emails_string = convertEmailsToString(emails);

    const message = "Your membersship to AssocEase will expire in a week!"

    // Finally send the reminder about the event
    const transporter = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:
            {
                user: "assocease@gmail.com",
                // This password is an App Password that was created for this example email address.
                // It can't be used to normally login to the gmail service.
                pass: "izdn grhs ymwm lxmx"
            }
        }
    );

    const mailOptions = {
        from: "assocease@gmail.com",
        to: emails_string,
        subject: 'AssocEase membership expiration notice',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

const SendExpirationNotice = async (emails) =>
{
    const emails_string = convertEmailsToString(emails);

    const message = "Your membersship to AssocEase expires today!"

    // Finally send the reminder about the event
    const transporter = nodemailer.createTransport(
        {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth:
            {
                user: "assocease@gmail.com",
                // This password is an App Password that was created for this example email address.
                // It can't be used to normally login to the gmail service.
                pass: "izdn grhs ymwm lxmx"
            }
        }
    );

    const mailOptions = {
        from: "assocease@gmail.com",
        to: emails_string,
        subject: 'AssocEase membership expiration notice',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
    });
}

const convertEmailsToString = (emails) =>
{
    // The email allows to send emails to multiple addresses at the same time.
    // They only need to be separated by a comma and a space. Turn the list of
    // emails in to a string of emails.
    let emails_string = '';

    for(let i = 0; i < emails.length; i++)
    {
        emails_string += emails[i].email;

        // If the email is not the last one in the list, add the separator.
        if (i < emails.length - 1)
        {
            emails_string += ', ';
        }
    }

    return emails_string;
}

module.exports = router;