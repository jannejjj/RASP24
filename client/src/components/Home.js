import { React, useState, useEffect } from "react";
import "../styles/HomePage.css";
import "../App.css";
import Button from "@mui/material/Button";
import { FaUserGroup } from "react-icons/fa6";
import CreateEventModal from "../modals/CreateEventModal";
import EditDetailsModal from "../modals/EditDetailsModal";
import EventItem from "./EventItem";
import { ToastContainer } from 'react-toastify';
import toasts from "../common/Toast";
import 'react-toastify/dist/ReactToastify.css';
import Typography from "@mui/material/Typography";
import { IoIosArrowDown } from "react-icons/io";

function Details(props) {
  const [admin, setAdmin] = useState(props.admin);
  const [details, setDetails] = useState(
    "According to Finnish university legislation, all degree students have to be members of a student union. Students will become members of the student union automatically after they have paid the student union membership fee. Post-graduate students may also join the student union but they have different benefits. There are approximately 5000 members in LTKY, both under-graduate and post-graduate students.\n\nThe symbol of LTKY is the first letter of Hebrew alphabet, Aalef, in red circled by a black gearwheel. As a mathematical symbol Aalef stands for ‘one’ which can be seen as a symbol of unity in LTKY."
  );
  const [title, setTitle] = useState("LTKY");
  const [memberCount, setMemberCount] = useState("...");

  useEffect(() => {
    const fetchMemberCount = async () => {
      await fetch(`api/membercount`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.log(data.error);
        } else {
          setMemberCount(data.memberCount);
        }
      });
    }
    fetchMemberCount()
  }, [])

  return(
    <div className='DetailsBackground'>
      <div className='Header'>
        <h1>
          {title}
        </h1>
        <p>
          <FaUserGroup className="FaUserGroup" />
          {memberCount} members
        </p>
      </div>
      <div className="HorizontalSeparator" />
      <div className="Text">
        <p style={{whiteSpace: "pre-wrap"}}>{details}</p>
      </div>
    </div>
  );
}
  

function Home(props) {
  const [admin, setAdmin] = useState(props.currentUser.admin);
  const [user, setUser ] = useState(null);
  const [newEventModal, setNewEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [joinDeadlineError, setJoinDeadlineError] = useState(false);
  const [checkedTicket, setCheckedTicket] = useState(false);
  const [checkedDeadline, setCheckedDeadline] = useState(false);
  const [tickets, setTickets] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingPastEvents, setLoadingPastEvents] = useState(false);
  const [updateEvents, setUpdateEvents] = useState(false);
  const [events, setEvents] = useState([{}]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastEvents, setPastEvents] = useState([]);
  const [showPastEvents, setShowPastEvents] = useState(false);


  const toggleUpdateEvents = () => {
    setUpdateEvents(!updateEvents);
  }

  useEffect(() => {
    const fetchUserData = async () => {
        // Check if props.currentUser.id is not null
        if (props.currentUser.id) {
          try {
            const response = await fetch(`/users/getData/${props.currentUser.id}`);
            if (!response.ok) {
                throw new Error('Failed to fetch user data');
            }
            setUser(await response.json());
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        }
      };
    fetchUserData();
  }, []);

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
  const handleImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleLocationChange = (value) => {
    if (value === null) {
      return;
    }
    setNewEvent({...newEvent, ["location"]: {name: value.structured_formatting.main_text, placeId: value.place_id}});
  }

  const cancelCreationOnClick = () => {
    setNewEvent({});
    setSelectedFile(null);
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
    let deadlineCorrect = false;
    if(!startTimeError && newEvent.startDate) {
      if(!endTimeError) {
        if(checkedDeadline && !joinDeadlineError && newEvent.joinDeadline && newEvent.joinDeadline <= newEvent.startDate) {
          deadlineCorrect = true;
        } else if (!checkedDeadline) {
          deadlineCorrect = true;
        }
        if(deadlineCorrect) {
          if(!newEvent.endDate || newEvent.startDate < newEvent.endDate) {
            newEvent.creator = props.currentUser.firstname + " " + props.currentUser.lastname;
            newEvent.creatorId = props.currentUser.id;
            newEvent.attendees = 1;

            var eventId = "";
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
                  eventId = data._id;
              })
            if(checkedTicket) {
              resetTickets();
            }
            if(checkedDeadline) {
              handleDeadlineSwitch();
            }
            if(!selectedFile){
              // Empty the input fields
              setNewEvent({});
              // Close the Modal
              setNewEventModal(false);
              // Update events list by toggling the boolean
              toggleUpdateEvents();
              toasts.showToastSuccessMessage("Event created successfully!");
              return;
            }  
            if (selectedFile.type !== 'image/png' && selectedFile.type !== 'image/jpeg') {
              // Empty the input fields
              setNewEvent({});
              // Close the Modal
              setNewEventModal(false);
              // Update events list by toggling the boolean
              toggleUpdateEvents();
              toasts.showToastMessage('The event was generated without an image due to an incorrect format');
              return;
            }
            const formData = new FormData();
            formData.append('image', selectedFile);
            const response = await fetch(`/api/updateImage/${eventId}`, {
              method: 'POST',
              body: formData
            });
            if(response.status == 413){
              toasts.showToastMessage("The event was created but the image is too big");
              // Empty the input fields
              setNewEvent({});
              // Close the Modal
              setNewEventModal(false);
              // Update events list by toggling the boolean
              toggleUpdateEvents();
              toasts.showToastSuccessMessage("Event created successfully!");
            }else{
              // Empty the input fields
              setNewEvent({});
              // Close the Modal
              setNewEventModal(false);
              // Update events list by toggling the boolean
              toggleUpdateEvents();
              toasts.showToastSuccessMessage("Event created successfully!");
            }
          } else {
            toasts.showToastMessage("Starting time needs to be before ending time.");
          }
        } else {
          toasts.showToastMessage("Event joining deadline needs to be before or the same as the starting time of the event.");
        }
      } else {
        toasts.showToastMessage("Ending time is not valid.");
      }
    } else {
      toasts.showToastMessage("Starting time is not valid.");
    }
  };

  const ShowPastEventsClick = async () =>
  {
    if (showPastEvents)
    {
      setShowPastEvents(false);
    }
    else
    {
      setLoadingPastEvents(true)
      const response = await fetch('/api/old/events', 
      {
        headers: 
        {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        }
      });

      const dataJson = await response.json();
      if (dataJson) {
          setPastEvents(dataJson);
          setLoadingPastEvents(false);
      }
      
      setShowPastEvents(true);
    }
  }

  return (
    <div className="HomePageBackground">
      <div className="DetailsArea">
        <Details admin={admin} />
      </div>

      <div className="HomeEventsList">
        <h1>Events</h1>
        <div className="HorizontalSeparator" style={{ width: "^95%" }} />
        
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
            user={user}
            admin={admin}
            event={event}
            key={index}
            toggleUpdateEvents={toggleUpdateEvents}
          />
        ))
        :
        <Typography sx={{ mt: 20 }} variant='h4' align="center">
          Please log in to see events.</Typography>
        }

        {!events?.length > 0 &&
          <Typography sx={{ mt: 20 }} variant='h4' align="center">{!events?.length>0 && "No events."}</Typography>
        }

        {(props.currentUser.admin && !loading) &&
          <div className="HomePastEvents">
            <div className="ShowPastEventsButton" onClick={ShowPastEventsClick}>
              <h3>{showPastEvents ? "Hide" : "Show"} Past Events</h3>
              <div className="HorizontalSeparator" />
              <IoIosArrowDown className="ShowPastEventsArrow" style={showPastEvents && {transform: "rotate(180deg)"}} />
            </div>

            {showPastEvents &&
              (!loadingPastEvents ? 
                ( 
                  pastEvents.map((event, index) => (
                    <EventItem
                      currentUser={props.currentUser}
                      user={user}
                      admin={admin}
                      event={event}
                      key={index}
                      oldEvent={true}
                      toggleUpdateEvents={toggleUpdateEvents}
                    />
                  ))
                )
                :
                (
                  <Typography sx={{ mt: 20 }} variant='h4' align="center">Loading...</Typography>
                )
              )
            }
          </div>
        }
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
        handleLocationChange={handleLocationChange}
        cancelCreationOnClick={cancelCreationOnClick}
        saveNewEventOnClick={saveNewEventOnClick}
        handleStartTimeError={handleStartTimeError}
        handleEndTimeError={handleEndTimeError}
        handleJoinDeadlineError={handleJoinDeadlineError}
        resetTickets={resetTickets}
        handleDeadlineSwitch={handleDeadlineSwitch}
        handleImageChange={handleImageChange}
      />
      <ToastContainer />
    </div>
  );
}

/* eslint-enable no-unused-vars */

export default Home;
