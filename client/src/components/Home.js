import { React, useState, useEffect } from "react";
import "../styles/HomePage.css";
import "../App.css";
import Button from "@mui/material/Button";
import { FaUserGroup } from "react-icons/fa6";
import CreateEventModal from "../modals/CreateEventModal";
import EditDetailsModal from "../modals/EditDetailsModal";
import EventItem from "./EventItem";
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
  const [updateEvents, setUpdateEvents] = useState(false);
  const [events, setEvents] = useState([{}]);


  const toggleUpdateEvents = () => {
    setUpdateEvents(!updateEvents);
  }

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
  
    const showToastSuccessMessage = (message) =>  {
      toast.success(message, {
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
  }, [updateEvents])

  // POST new event
  const saveNewEventOnClick = async (e) => {
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
            await fetch("/api/event", {
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
          // Update events list by toggling the boolean
          toggleUpdateEvents();
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

        {props.currentUser.loggedIn
        ?
        !loading && events.map((event, index) => (
          <EventItem
            currentUser={props.currentUser}
            id={event._id}
            admin={admin}
            eventID={event._id}
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
            tickets={event.tickets}
            ticketsSold={event.ticketsSold}
            price={event.price}
            key={index}
            showToastMessage={showToastMessage}
            showToastSuccessMessage={showToastSuccessMessage}
            token={props.currentUser.token}
            toggleUpdateEvents={toggleUpdateEvents}
          />
        ))
        :
        <Typography sx={{ mt: 20 }} variant='h4' align="center">
          Please log in to see events.</Typography>
        }

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
