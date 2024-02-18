import { React, useState } from "react";
import "../styles/HomePage.css";
import "../App.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { FaUserGroup } from "react-icons/fa6";
import CancelAttendanceModal from "../modals/CancelAttendanceModal";
import ConfirmAttendanceModal from "../modals/ConfirmAttendanceModal";
import CreateEventModal from "../modals/CreateEventModal";
import EditEventModal from "../modals/EditEventModal";
import EditDetailsModal from "../modals/EditDetailsModal";
import dayjs from 'dayjs';

function Details(props) {
  const [admin, setAdmin] = useState(props.admin);
  const [details, setDetails] = useState(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis imperdiet est, ut maximus est lobortis non. Aliquam bibendum venenatis mi, a auctor lacus interdum feugiat. Aenean nec leo a diam iaculis iaculis. Vestibulum cursus tincidunt neque, quis euismod dolor tincidunt ac."
  );
  const [detailsHistory, setDetailsHistory] = useState(details);
  const [changedDetails, setChangedDetails] = useState(details);
  const [title, setTitle] = useState("Association Ry");
  const [titleHistory, setTitleHistory] = useState(title);
  const [changedTitle, setChangedTitle] = useState(title);
  const [manageDetails, setManageDetails] = useState(false);

  const saveEditOnClick = () => {
    setDetailsHistory(changedDetails);
    setTitleHistory(changedTitle);
    setDetails(changedDetails);
    setTitle(changedTitle);
    setManageDetails(false);
  };

  const cancelEditOnClick = () => {
    setDetails(detailsHistory);
    setTitle(titleHistory);
    setChangedDetails(detailsHistory);
    setChangedTitle(titleHistory);
    setManageDetails(false);
  };

  const handleDetailsChange = (event) => {
    setChangedDetails(event.target.value);
  };

  const handleTitleChange = (event) => {
    setChangedTitle(event.target.value);
  }

  return(
    <div className='DetailsBackground'>
      <div className='Header'>
        <h1>
          {title}
        </h1>
        <p>
          <FaUserGroup className="FaUserGroup" /> 123 members
        </p>
      </div>
      <div className="HorizontalSeparator" />
      <div className="Text">
        <p>{details}</p>
      </div>
      {admin && (
        <div className="EditDetailsButtonArea">
          <Button
            variant="outlined"
            onClick={() => {
              setManageDetails(true);
            }}
          >
            Edit
          </Button>
        </div>
      )}

      <EditDetailsModal
        edit={manageDetails}
        title={changedTitle}
        details={changedDetails}
        handleDetailsChange={handleDetailsChange}
        handleTitleChange={handleTitleChange}
        saveEditOnClick={saveEditOnClick}
        cancelEditOnClick={cancelEditOnClick}
      />
    </div>
  );
}

function EventItem(props) {
  // These states store the original event data
  const [attending, setAttending] = useState(props.attending);
  const [title, setTitle] = useState(props.title);
  const [time, setTime] = useState(props.time);
  const [location, setLocation] = useState(props.location);
  const [description, setDescription] = useState(props.description);
  const [attendees, setAttendees] = useState(props.attendees);

  // These states store the data that is edited
  const [edit, setEdit] = useState(false);
  const [openAttend, setOpenAttend] = useState(false);
  const [openCancelAttendance, setOpenCancelAttendance] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedTime, setEditedTime] = useState(props.time);
  const [editedLocation, setEditedLocation] = useState(props.location);
  const [editedDescription, setEditedDescription] = useState(props.description);

  // Save the history so that the editing can be cancelled
  const [titleHistory, setTitleHistory] = useState(props.title);
  const [timeHistory, setTimeHistory] = useState(props.time);
  const [locationHistory, setLocationHistory] = useState(props.location);
  const [descriptionHistory, setDescriptionHistory] = useState(
    props.description
  );

  const editOnClick = () => {
    setEdit(true);
  };

  const saveEditOnClick = () => {
    // TODO: Send the edited values to the database to actually save the edit

    // Update the history
    setTitleHistory(editedTitle);
    setTimeHistory(editedTime);
    setLocationHistory(editedLocation);
    setDescriptionHistory(editedDescription);

    // Update the actual values
    setTitle(editedTitle);
    setTime(editedTime);
    setLocation(editedLocation);
    setDescription(editedDescription);

    // Close the edit
    setEdit(false);
  };

  const cancelEditOnClick = () => {
    // Bring back the old event data
    setTitle(titleHistory);
    setTime(timeHistory);
    setLocation(locationHistory);
    setDescription(descriptionHistory);

    // Also reset the changes to the edited values
    setEditedTitle(titleHistory);
    setEditedTime(timeHistory);
    setEditedLocation(locationHistory);
    setEditedDescription(descriptionHistory);

    // Close the edit
    setEdit(false);
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleTimeChange = (event) => {
    setEditedTime(event.target.value);
  };

  const handleLocationChange = (event) => {
    setEditedLocation(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setEditedDescription(event.target.value);
  };

  const handleEventAttendance = () => {
    setOpenAttend(false);
    setAttending(true);
    setAttendees(attendees + 1);
  };

  const handleCancelEventAttendance = () => {
    setOpenCancelAttendance(false);
    setAttending(false);
    setAttendees(attendees - 1);
  };

  return (
    <div className="HomeEventItem">
      <div className="HomeEventTop">
        <div className="HomeEventPhotoBackground">
          <img
            src="https://blogs.lut.fi/newcomers/wp-content/uploads/sites/15/2020/02/talvi-ilma-1-1.jpg"
            alt="Event"
          />
        </div>

        <div className="HomeEventHeaderArea">
          <div className="HomeEventTitleAndLocationArea">
            <h2>{title}</h2>
            <h3>Created by: {props.creator}</h3>
            <h3>{time}</h3>
            <h3>{location}</h3>
          </div>

          <p>
            <FaUserGroup style={{ margin: "0 5px 0 0" }} /> {attendees}
          </p>
        </div>
      </div>

      <div className="HomeEventBottom">
        <div className="HorizontalSeparator" />
        <div className="HomeEventDescriptionArea">
          <p>{description}</p>
        </div>

        <div className='HomeEventAttendanceButtonsArea'>
          {props.admin && 
            (
              <Button className='EditEventButton' variant='contained' onClick={editOnClick} >Edit</Button>
            )
          }
          <div>
            {attending ? 
              (
                <Button variant='outlined' color='primary' onClick={() => {setOpenCancelAttendance(true)}} >Cancel Attendance</Button>
              )
              :
              (
                <Button variant='contained' color='primary' onClick={() => {setOpenAttend(true)}} >Attend the Event</Button>
              )
            }
          </div>
        </div>
      </div>

      <EditEventModal
        edit={edit}
        editedDescription={editedDescription}
        editedLocation={editedLocation}
        editedTime={editedTime}
        editedTitle={editedTitle}
        handleTitleChange={handleTitleChange}
        handleTimeChange={handleTimeChange}
        handleLocationChange={handleLocationChange}
        handleDescriptionChange={handleDescriptionChange}
        cancelEditOnClick={cancelEditOnClick}
        saveEditOnClick={saveEditOnClick}
      />

      <ConfirmAttendanceModal
        openAttend={openAttend}
        setOpenAttend={setOpenAttend}
        handleEventAttendance={handleEventAttendance}
      />

      <CancelAttendanceModal
        openCancelAttendance={openCancelAttendance}
        setOpenCancelAttendance={setOpenCancelAttendance}
        handleCancelEventAttendance={handleCancelEventAttendance}
      />
    </div>
  );
}

function Home(props) {
  const [admin, setAdmin] = useState(props.currentUser.admin);
  const [newEvent, setNewEvent] = useState(false);
  const [events, setEvents] = useState([
    {
      title: "TechSynergy Summit",
      creator: "Emily Thompson",
      time: "26.2.2024 12:00",
      location: "LUT University",
      attendees: 41,
      attending: true,
      description: `The TechSynergy Summit is a premier corporate event designed to bring together industry leaders, visionaries, and innovators in the ever-evolving landscape of technology. This exclusive summit serves as a dynamic platform or collaboration, knowledge exchange, and networking. Attendees can expect insightful keynote presentations, interactive panel discussions, and hands-on workshops that explore the intersection of cutting-edge technologies, fostering an environment where ideas converge, and innovation thrives. Join us at TechSynergy Summit to be at the forefront of the technological revolution and cultivate meaningful connections that propel your organization into the future.`,
    },
    {
      title: "FutureTech Showcase",
      creator: "Liam Patel",
      time: "2.4.2024 14:00",
      location: "LUT University",
      attendees: 24,
      attending: false,
      description: `Step into the future with FutureTech Showcase, where cutting-edge innovations and breakthrough technologies converge. Explore the latest advancements in robotics, artificial intelligence, and beyond. Immerse yourself in a curated exhibition that unveils tomorrow's tech landscape today.`,
    },
    {
      title: "Digital Nexus Symposium",
      creator: "Sophia Mitchell",
      time: "18.7.2024 10:00",
      location: "LUT University",
      attendees: 98,
      attending: false,
      description: `Join thought leaders and industry experts at the Digital Nexus Symposium, a dynamic gathering that explores the interconnected world of digital technologies. Engage in insightful discussions on the impact of AI, data analytics, and cyber-physical systems. Discover the converging points shaping our digital future at this symposium of ideas and collaboration.`,
    },
  ]);

  // Data for for the new events
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };

  const handleTimeChange = (value) => {
    setNewTime(value);
  };

  const handleLocationChange = (event) => {
    setNewLocation(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setNewDescription(event.target.value);
  };

  const cancelCreationOnClick = () => {
    setNewEvent(false);
    setNewTime("");
    setNewTitle("");
    setNewDescription("");
    setNewLocation("");
  };

  const saveNewEventOnClick = (e) => {
    console.log(JSON.stringify({title: newTitle, startDate: newTime, location: newLocation, description: newDescription}));
    e.preventDefault()
        //Creates new post if user is authenticated with jwt token and redirects to '/'
        fetch("/api/event", {
            method: "POST",
            headers: {
                "Content-type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem('token')
            },
            body: JSON.stringify({title: newTitle, startDate: newTime, location: newLocation, description: newDescription}),
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => {
                console.log(data)
            })
    // Empty the input fields
    setNewTime("");
    setNewTitle("");
    setNewDescription("");
    setNewLocation("");

    // Close the Modal
    setNewEvent(false);
  };



  return (
    
    <div className="HomePageBackground">
      <div className="DetailsArea">
        <Details admin={admin} />
      </div>

      <div className="HomeEventsList">
        <h1>Events</h1>
        <div className="HorizontalSeparator" style={{ width: "95%" }} />
        {admin && (
          <Button color="primary" variant='contained' onClick={() => {setNewEvent(true)}} style={{margin: "10px 0 10px 0"}} >Add New Event</Button>
        )}
        {events.map((event, index) => (
          <EventItem
            admin={admin}
            title={event.title}
            creator={event.creator}
            time={event.time}
            location={event.location}
            attendees={event.attendees}
            attending={event.attending}
            description={event.description}
            key={index}
          />
        ))}
      </div>

      <CreateEventModal
        newEvent={newEvent}
        newTime={dayjs(new Date())}
        newTitle={newTitle}
        newLocation={newLocation}
        newDescription={newDescription}
        handleTitleChange={handleTitleChange}
        handleTimeChange={handleTimeChange}
        handleLocationChange={handleLocationChange}
        handleDescriptionChange={handleDescriptionChange}
        cancelCreationOnClick={cancelCreationOnClick}
        saveNewEventOnClick={saveNewEventOnClick}
      />
    </div>
  );
}

/* eslint-enable no-unused-vars */

export default Home;
