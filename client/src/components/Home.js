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
import Typography from "@mui/material/Typography";

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

  const [editedEvent, setEditedEvent] = useState({});
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [joinDeadlineError, setJoinDeadlineError] = useState(false);

  const [attending, setAttending] = useState(props.attending);
  const [attendees, setAttendees] = useState(props.attendees);

  // These states store the original event data
  const [title, setTitle] = useState(props.title);
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);
  const [joinDeadlineDate, setJoinDeadlineDate] = useState(props.joinDeadline);
  const [location, setLocation] = useState(props.location);
  const [description, setDescription] = useState(props.description);
  const [price, setPrice] = useState(props.price);
  const [tickets, setTickets] = useState(props.tickets);

  const [checkedTicket, setCheckedTicket] = useState(false);
  const [checkedDeadline, setCheckedDeadline] = useState(false);


  // These states store the data that is edited
  const [edit, setEdit] = useState(false);
  const [openAttend, setOpenAttend] = useState(false);
  const [openCancelAttendance, setOpenCancelAttendance] = useState(false);
  

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

  // POST edited event
  const saveEditedEventOnClick = (e) => {
    e.preventDefault()
    if(!startTimeError && editedEvent.startDate) {
      if(!endTimeError) {
        if(!checkedDeadline) {
          editedEvent.joinDeadline = editedEvent.startDate;
        }
        if(!joinDeadlineError && editedEvent.joinDeadline && editedEvent.joinDeadline <= editedEvent.startDate) {
          if(!editedEvent.endDate || editedEvent.startDate < editedEvent.endDate) {
            editedEvent.creator = props.currentUser.firstname + " " + props.currentUser.lastname;
            editedEvent.creatorId = props.currentUser.id;
            editedEvent.attendees = 1;
            editedEvent.id = props.eventID;
            
            setEditedEvent(editedEvent);
            fetch("/api/event", { // TODO change url to event edit url
              method: "POST",
              headers: {
                  "Content-type": "application/json",
                  "Authorization": "Bearer " + props.currentUser.token
              },
              body: JSON.stringify(editedEvent),
              mode: "cors"
          })
              .then(response => response.json())
              .then(data => {
                  console.log(data)
              })
          // Empty the input fields
          setEditedEvent({});
          // Close the Modal
          setEdit(false);
          if(checkedTicket) {
            resetTickets();
          }
          if(checkedDeadline) {
            handleDeadlineSwitch();
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


//Resets the amount of tickets and clears the text box.
const resetTickets = () => {
  setTickets("");
  setCheckedTicket(!checkedTicket);
  editedEvent.tickets = 0;
  setEditedEvent(editedEvent);
}

const handleDeadlineSwitch = () => {
  setCheckedDeadline(!checkedDeadline);
  if(!checkedDeadline) {
    editedEvent.joinDeadline = "";
  } else {
    editedEvent.joinDeadline = editedEvent.startDate;
  }
  
  setEditedEvent(editedEvent);
}

//Updates the values for the text fields in event creation
const whenChanging = (event) => {
  setEditedEvent({...editedEvent, [event.target.id]: event.target.value})
}

//Updates the values for the start time
const handleStartTimeChange = (value) => {
  setStartTimeError(false); // Sets error to false when changes are made
  setEditedEvent({...editedEvent, ["startDate"]: value});
};

//Updates the values for the end time
const handleEndTimeChange = (value) => {
  setEndTimeError(false); // Sets error to false when changes are made
  setEditedEvent({...editedEvent, ["endDate"]: value});
};

//Updates the values for the join deadline
const handleJoinDeadlineChange = (value) => {
  setJoinDeadlineError(false); // Sets error to false when changes are made
  setEditedEvent({...editedEvent, ["joinDeadline"]: value});
};

const cancelEditOnClick = () => {
  setEditedEvent({});
  if(checkedTicket) {
    resetTickets();
  }
  if(checkedDeadline) {
    handleDeadlineSwitch();
  }
  setEdit(false);
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
  // Show edit
  const editOnClick = () => {
    setEdit(true);
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


  if(props.loggedIn) {
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
              <h3>{startDate}</h3>
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
          edit={edit} // visible
          checkedTicket={checkedTicket}
          checkedDeadline={checkedDeadline}
          tickets={tickets}
          setCheckedDeadline={setCheckedDeadline}
          setTickets={setTickets}
          setCheckedTicket={setCheckedTicket}
          whenChanging={whenChanging}
          handleStartTimeChange={handleStartTimeChange}
          handleEndTimeChange={handleEndTimeChange}
          handleJoinDeadlineChange={handleJoinDeadlineChange}
          cancelEditOnClick={cancelEditOnClick}
          saveEditedEventOnClick={saveEditedEventOnClick}
          handleStartTimeError={handleStartTimeError}
          handleEndTimeError={handleEndTimeError}
          handleJoinDeadlineError={handleJoinDeadlineError}
          resetTickets={resetTickets}
          handleDeadlineSwitch={handleDeadlineSwitch}
          
          //old values
          title={title}
          description={description}
          location={location}
          startDate={startDate}
          endDate={endDate}
          joinDeadlineDate={joinDeadlineDate}
          price={price}
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
  } else {
    return (
      <Typography sx={{ mt: 20 }} variant='h4' align="center">
         Please login to view events.
      </Typography>
    );
  }
  }
  

function Home(props) {
  const [admin, setAdmin] = useState(props.currentUser.admin);
  const [newEventModal, setNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [joinDeadlineError, setJoinDeadlineError] = useState(false);
  const [checkedTicket, setCheckedTicket] = useState(false);
  const [checkedDeadline, setCheckedDeadline] = useState(false);
  const [tickets, setTickets] = useState("");
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([{}]);

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
    setTickets("");
    setCheckedTicket(!checkedTicket);
    newEvent.tickets = 0;
    setNewEvent(newEvent);
  }

  const handleDeadlineSwitch = () => {
    setCheckedDeadline(!checkedDeadline);
    if(!checkedDeadline) {
      newEvent.joinDeadline = "";
    } else {
      newEvent.joinDeadline = newEvent.startDate;
    }
    
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
    if(checkedTicket) {
      resetTickets();
    }
    if(checkedDeadline) {
      handleDeadlineSwitch();
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
        if(!checkedDeadline) {
          newEvent.joinDeadline = newEvent.startDate;
        }
        if(!joinDeadlineError && newEvent.joinDeadline && newEvent.joinDeadline <= newEvent.startDate) {
          if(!newEvent.endDate || newEvent.startDate < newEvent.endDate) {
            newEvent.creator = props.currentUser.firstname + " " + props.currentUser.lastname;
            newEvent.creatorId = props.currentUser.id;
            newEvent.attendees = 1;
            
            setNewEvent(newEvent);
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
          if(checkedTicket) {
            resetTickets();
          }
          if(checkedDeadline) {
            handleDeadlineSwitch();
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
        {loading && <Typography sx={{ mt: 20 }} variant='h4' align="center">
            Loading...
          </Typography>}
        {!loading && events.map((event, index) => (
          <EventItem
            admin={admin}
            eventID={event.id}
            currentUser={props.currentUser}
            loggedIn={props.currentUser.loggedIn}
            title={event.title}
            creator={event.creator}
            creatorId={event.creatorId}
            startDate={event.startDate}
            joinDeadline={event.joinDeadline}
            endDate={event.endDate}
            location={event.location}
            attendees={event.attendees}
            attending={event.attending}
            description={event.description}
            price={event.price}
            key={index}
            tickets={event.tickets}
          />
        ))}
        <Typography sx={{ mt: 20 }} variant='h4' align="center">{!events?.length>0 && "No events."}</Typography>
      </div>

      <CreateEventModal
        newEventModal={newEventModal}
        checkedTicket={checkedTicket}
        checkedDeadline={checkedDeadline}
        tickets={tickets}
        setCheckedDeadline={setCheckedDeadline}
        setTickets={setTickets}
        setCheckedTicket={setCheckedTicket}
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
        handleDeadlineSwitch={handleDeadlineSwitch}
      />
      <ToastContainer />
    </div>
  );
}

/* eslint-enable no-unused-vars */

export default Home;
