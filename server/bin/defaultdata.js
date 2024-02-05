//this is just some data example to see how the database is going
const Member = require("../models/member");
const Association = require("../models/association");
const Event = require("../models/event");
const Notification = require("../models/notification");
const Link = require("../models/link");
const Member_Association = require("../models/member_association");
const Member_Event = require("../models/member_event");
const mongoose = require("mongoose");

const memberAux =[
    {
    "firstname":"Alejandro",
    "lastname": "Vargas",
    "phone": "123456789",
    "address" : "example1",
    "postalcode" : "example1",
    "city":"Concepcion",
    "country": "Chile",
    "email": "example1@gmail.com",
    "password": "password",
    "admin": false,
    "profileImage": []
    },
    {
        "firstname":"Daniel",
        "lastname": "Ladron",
        "phone": "123456789",
        "address" : "example2",
        "postalcode" : "example2",
        "city":"Seul",
        "country": "korea",
        "email": "example2@gmail.com",
        "password": "password",
        "admin": false,
        "profileImage": []
    }
];
let associationAux = {
    "name": "Sample Event",
    "description": "This is a sample event description.",
    "paymentDate": "2024-01-26T12:00:00.000Z",
    "associationImage": [],
    "event": [],
    "link": [],
    "notification": []
};
let eventAux = {
    "name": "Sample Event",
    "description": "This is a sample event description.",
    "startDate": "2024-01-26T10:00:00.000Z",
    "endDate": "2024-01-27T18:00:00.000Z",
    "place": "Sample Venue",
    "logo": [],
    "price": 25.99,
    "paymentDate": "2024-01-26T12:00:00.000Z",
    "link": [],
    "notification": []
};
const notificationAux = [
    {
    "title": "Announcement",
    "message": "We are excited to announce a new feature on our platform!",
    "date": "2024-01-26T15:30:00.000Z"
  },
  {
    "title": "Reminder",
    "message": "Don't forget about the upcoming meeting tomorrow!",
    "date": "2024-01-27T09:00:00.000Z"
  }];
const linkAux = [
    {
    "name": "Youtube video",
    "link": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  },
  {
    "name": "Youtube video",
    "link": "https://www.youtube.com/watch?v=KOaeDHeJ80I"
  }
  ];
  
  async function insertSampleData() {
    try {
      const members = await Member.create(memberAux);
      const memberIds = members.map(member => member._id);

      const notifications = await Notification.create(notificationAux);
      const notificationIds = notifications.map(notification => notification._id);

      const links = await Link.create(linkAux);
      const linkIds = links.map(link => link._id);

      associationAux.link = linkIds;
      associationAux.notification = notificationIds;
      eventAux.link = linkIds;
      eventAux.notification = notificationIds;

      const event = await Event.create(eventAux);
      const eventId = event._id;

      associationAux.event = eventId;

      const association = await Association.create(associationAux);
      const associationId = association._id;

      

      const member_eventAux = [{
        "date": "2024-01-26T18:30:00.000Z",
        "paid": true,
        "member": memberIds[0],  
        "event": eventId    
      },
      {
        "date": "2024-01-26T18:30:00.000Z",
        "paid": false,
        "member": memberIds[1],  
        "event": eventId    
      }];
      const member_associationAux = [{
        "date": "2024-01-26T18:30:00.000Z",
        "paid": true,
        "member": memberIds[1],  
        "association": associationId    
      },
      {
        "date": "2024-01-26T18:30:00.000Z",
        "paid": false,
        "member": memberIds[0],  
        "association": associationId    
      }];
      
      const member_association = await Member_Association.create(member_associationAux);
      const member_event = await Member_Event.create(member_eventAux);
      
  
      console.log("Sample data inserted successfully!");
    } catch (error) {
      console.error("Error inserting sample data:", error);
    } 
  };

  async function deleteAllDocuments() {
    try {
      await Member.deleteMany({});
      await Association.deleteMany({});
      await Event.deleteMany({});
      await Notification.deleteMany({});
      await Link.deleteMany({});
      await Member_Association.deleteMany({});
      await Member_Event.deleteMany({});
  
      console.log("All documents deleted successfully!");
    } catch (error) {
      console.error("Error deleting documents:", error);
    } 
  };

  module.exports = {deleteAllDocuments, insertSampleData}; 
