import { React, useState } from "react";
import "../styles/HomePage.css";
import "../App.css";
import Button from "@mui/material/Button";
import { FaUserGroup } from "react-icons/fa6";
import CreateEventModal from "../modals/CreateEventModal";
import EditDetailsModal from "../modals/EditDetailsModal";
import EventItem from "./EventItem";

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

  const handleTimeChange = (event) => {
    setNewTime(event.target.value);
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

  const saveNewEventOnClick = () => {
    // TODO: Send the event data to the server

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
        newTime={newTime}
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
