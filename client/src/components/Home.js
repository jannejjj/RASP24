import { React, useState, useEffect } from "react";
import "../styles/HomePage.css";
import "../App.css";
import Button from "@mui/material/Button";
import { FaUserGroup } from "react-icons/fa6";
import CancelAttendanceModal from "../modals/CancelAttendanceModal";
import ConfirmAttendanceModal from "../modals/ConfirmAttendanceModal";
import CreateEventModal from "../modals/CreateEventModal";
import EditEventModal from "../modals/EditEventModal";
import EditDetailsModal from "../modals/EditDetailsModal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
  const [newEventModal, setNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [joinDeadlineError, setJoinDeadlineError] = useState(false);
  const [checked, setChecked] = useState(false);
  const [tickets, setTickets] = useState("");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([{}]);
  /*
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
  */
  const showToastMessage = (message) =>
    {
        toast.error(message, {
            position: "top-center",
            autoClose: 6000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark"
            });
    }

  //Resets the amount of tickets and clears the text box.
  const resetTickets = () => {
    console.log("Reset tickets");
    setTickets("");
    setChecked(!checked);
    newEvent.tickets = "";
    setNewEvent(newEvent);
  }

  //Updates the values for the text fields in event creation
  const whenChanging = (event) => {
    setNewEvent({...newEvent, [event.target.id]: event.target.value})
  }
  
  //Updates the values for the start time
  const handleStartTimeChange = (value) => {
    setStartTimeError(false); // Sets error to false when changes are made
    setNewEvent({...newEvent, ["startDate"]: value});
  };

  //Updates the values for the end time
  const handleEndTimeChange = (value) => {
    setEndTimeError(false); // Sets error to false when changes are made
    setNewEvent({...newEvent, ["endDate"]: value});
  };

//Updates the values for the join deadline
  const handleJoinDeadlineChange = (value) => {
    setJoinDeadlineError(false); // Sets error to false when changes are made
    setNewEvent({...newEvent, ["joinDeadline"]: value});
  };

  const cancelCreationOnClick = () => {
    setNewEvent({});
    if(checked) {
      resetTickets();
    }
    setNewEventModal(false);
  };

  // Triggered if there is an error in the date formatting
  const handleStartTimeError = (error) => {
    console.log("Starting time error: " + error);
    setStartTimeError(true);
  }

  const handleEndTimeError = (error) => {
    console.log("Ending time error: " + error);
    setEndTimeError(true);
  }

  const handleJoinDeadlineError = (error) => {
    console.log("Join deadline error: " + error);
    setJoinDeadlineError(true);
  }

  // Fetches events from API
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    async function fetchEvents() {
        let url = '/api/events';
        let response = await fetch(url, {headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        }});
        let dataJson = await response.json();
        if (mounted) {
            setEvents(dataJson);
            setLoading(false);
        }
      }
  // Only for users that have logged in
  if (props.currentUser.loggedIn)
  {
    fetchEvents();
    return () => {
        mounted = false;
    };
  }
  setLoading(false);
  }, [])

  // POST new event
  const saveNewEventOnClick = (e) => {
    e.preventDefault()
    if(!startTimeError && newEvent.startDate) {
      if(!endTimeError) {
        if(!joinDeadlineError && newEvent.joinDeadline <= newEvent.startDate) {
          if(!newEvent.endDate || newEvent.startDate < newEvent.endDate) {
            fetch("/api/event", {
              method: "POST",
              headers: {
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + props.currentUser.token
              },
              body: JSON.stringify(newEvent),
              mode: "cors"
          })
              .then(response => response.json())
              .then(data => {
                  console.log(data)
              })
          // Empty the input fields
          setNewEvent({});
          // Close the Modal
          setNewEventModal(false);
          if(checked) {
            resetTickets();
          }
          } else {
            console.log("Starting time needs to be before ending time.");
            showToastMessage("Starting time needs to be before ending time.");
          }
        } else {
          console.log("Event joining deadline needs to be before or the same as the starting time of the event.");
            showToastMessage("Event joining deadline needs to be before or the same as the starting time of the event.");
        }
      } else {
        console.log("Ending time is not valid.");
        showToastMessage("Ending time is not valid.");
      }
    } else {
      console.log("Starting time is not valid.");
      showToastMessage("Starting time is not valid.");
    }
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
          <Button color="primary" variant='contained' onClick={() => {setNewEventModal(true)}} style={{margin: "10px 0 10px 0"}} >Add New Event</Button>
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
        newEventModal={newEventModal}
        checked={checked}
        tickets={tickets}
        setTickets={setTickets}
        setChecked={setChecked}
        whenChanging={whenChanging}
        handleStartTimeChange={handleStartTimeChange}
        handleEndTimeChange={handleEndTimeChange}
        handleJoinDeadlineChange={handleJoinDeadlineChange}
        cancelCreationOnClick={cancelCreationOnClick}
        saveNewEventOnClick={saveNewEventOnClick}
        handleStartTimeError={handleStartTimeError}
        handleEndTimeError={handleEndTimeError}
        handleJoinDeadlineError={handleJoinDeadlineError}
        resetTickets={resetTickets}
      />
      <ToastContainer />
    </div>
  );
}

/* eslint-enable no-unused-vars */

export default Home;
