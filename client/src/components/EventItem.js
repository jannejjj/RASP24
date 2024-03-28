import { React, useEffect, useState } from "react";
import "../styles/HomePage.css";
import "../styles/EventItem.css";
import "../App.css";
import Button from "@mui/material/Button";
import { FaUserGroup } from "react-icons/fa6";
import CancelAttendanceModal from "../modals/CancelAttendanceModal";
import ConfirmAttendanceModal from "../modals/ConfirmAttendanceModal";
import EditEventModal from "../modals/EditEventModal";
import DeleteEventModal from "../modals/DeleteEventModal";
import EventDetails from "./EventDetails";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import dayjs from 'dayjs';

function EventItem(props) {

  const [editedEvent, setEditedEvent] = useState({});
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [joinDeadlineError, setJoinDeadlineError] = useState(false);
  const [attendees, setAttendees] = useState(props.attendees);

  // These states store the original event data
  const [attending, setAttending] = useState(props.attending);
  const [title, setTitle] = useState(props.title);
  const [location, setLocation] = useState(props.location);
  const [description, setDescription] = useState(props.description);
  const [ticketsSold, setTicketsSold] = useState(props.ticketsSold);
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);
  const [joinDeadline, setJoinDeadlineDate] = useState(props.joinDeadline);
  const [price, setPrice] = useState(props.price);
  const [tickets, setTickets] = useState(props.tickets);
  const [checkedTicket, setCheckedTicket] = useState(props.tickets !== 0 && props.tickets !== null && props.tickets !== undefined);
  const [checkedDeadline, setCheckedDeadline] = useState(props.joinDeadline !== null && props.joinDeadline !== undefined);

  // These states store the data that is edited
  const [edit, setEdit] = useState(false);
  const [openAttend, setOpenAttend] = useState(false);
  const [openCancelAttendance, setOpenCancelAttendance] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.title);
  const [editedTime, setEditedTime] = useState(props.time);
  const [editedLocation, setEditedLocation] = useState(props.location);
  const [editedDescription, setEditedDescription] = useState(props.description);
  
  // State for event deletion modal
  const [deleteModal, setDeleteModal] = useState(false);

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
const showToastMessageSuccesfull = (message) =>
{
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
};

const savingErrorMessages = [
  "Starting time is not valid.",
  "Ending time is not valid.",
  "Event joining deadline needs to be before or the same as the starting time of the event.",
  "Starting time needs to be before ending time.",
  "Tickets should be more than the tickets already sold"
]

const savingRules = () => {
  if(startTimeError || !editedEvent.startDate) return savingErrorMessages[0];
  if(endTimeError)  return savingErrorMessages[1];
  if(!checkedDeadline) {
    editedEvent.joinDeadline = undefined;
  }
  const startDateAux = new Date(editedEvent.startDate);
  const joinDeadlineAux = new Date(editedEvent.joinDeadline);
  const endDateAux = new Date(editedEvent.endDate);
  if(joinDeadlineError || !editedEvent.joinDeadline || joinDeadlineAux > startDateAux)return savingErrorMessages[2];
  if(editedEvent.endDate && startDateAux >= endDateAux) return savingErrorMessages[3];
  return "";
};

  const saveEditedEventOnClick = (e) => {
    e.preventDefault();
    let errorMessage = savingRules();
    let successToast = false; //Doesn't work currently.
    if (errorMessage != ""){
      console.log(errorMessage);
      showToastMessage(errorMessage);
      return;
    }
    console.log(checkedDeadline);
    if(!checkedDeadline) {
      editedEvent.joinDeadline = undefined;
    }
    editedEvent.creator = props.currentUser.firstname + " " + props.currentUser.lastname;
    editedEvent.creatorId = props.currentUser.id;
    editedEvent.attendees = 1;
    editedEvent.id = props.eventID;
    
    setEditedEvent(editedEvent);
    fetch("/api/editEvent", { // TODO change url to event edit url
      method: "POST",
      headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
      },
      body: JSON.stringify(editedEvent),
      mode: "cors"
    })  
    .then(response =>{
        if(response.status === 409){
          errorMessage = "tickets should be more than the tickets already sold";
          console.log(errorMessage);
          showToastMessage(errorMessage);
          return;
        }
        return response.json();
    } )
    .then(data => {
      if (data) { 
        // if(! successToast){
        //   showToastMessageSuccesfull(`${data.event.ticketsSold} users will be notified of the changes`);
        //   successToast = true;
        // }
        // For some reason the Toast is showing twice.
        setEditedEvent({});
        // Close the Modal
        setEdit(false);
        props.toggleUpdateEvents();
      }
    });
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
    if(checkedDeadline) {
      editedEvent.joinDeadline = "";
      setJoinDeadlineDate("");
    } else {
      editedEvent.joinDeadline = editedEvent.startDate;
      setJoinDeadlineDate(editedEvent.startDate);
    }
    
    setEditedEvent(editedEvent);
  }

  //Updates the values for the text fields in event creation
  const whenChanging = (event) => {
    setEditedEvent({...editedEvent, [event.target.id]: event.target.value})
  }

  const cancelEditOnClick = () => {
    setEditedEvent({});
    if(!checkedTicket) {
      resetTickets();
    }
    if(checkedDeadline) {
      handleDeadlineSwitch();
    }
    setEdit(false);
  };

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
    setEditedEvent({...editedEvent, ["joinDeadline"]: dayjs(value)});
  };

  // Triggered if there is an error in the date formatting
const handleStartTimeError = (error) => {
  if(error == "disablePast"){
    setStartTimeError(false);
  }else{
    console.log("Starting time error: " + error);
    setStartTimeError(true);
  }
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
    // Set editedEvent to contain the original event data
    setEditedEvent({
      title: title,
      startDate: startDate,
      endDate: endDate,
      joinDeadline: joinDeadline,
      location: location,
      description: description,
      price: props.price,
      tickets : tickets
    });
    setEdit(true);
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

  const handleEventAttendance = async () => {
    const body =
    {
      eventID: props.id,
      userID: props.currentUser.id
    }

    await fetch("/api/attend/event", 
      {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        },
        body: JSON.stringify(body)
      }
    );

    // Close the modal and update the event list
    setOpenAttend(false);
    props.toggleUpdateEvents();
  };

  const handleCancelEventAttendance = async () => 
  {
    await fetch("/api/cancel/attendance/" + props.id + "/" + props.currentUser.id,
    {
      method: "DELETE",
      headers: {
        "Content-type": "application",
        "Authorization": "Bearer " + props.currentUser.token
      }
    })
    .then(response => response.json)
    .then(data =>
      {
        if (data.success === false)
        {
          console.log("Error while trying to cancel attendance");
        }
      })

    // Close the modal and update the event list
    setOpenCancelAttendance(false);
    props.toggleUpdateEvents();
  };

  const deleteOnClick = () => {
    setDeleteModal(true);
  };

  const cancelDeleteOnClick = () => {
    setDeleteModal(false);
  };

  const confirmDeleteOnClick = () => {
    fetch('/api/event/' + props.id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.token,
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        props.showToastMessage(data.error);
      } else {
        props.showToastSuccessMessage(data.message);
        props.toggleUpdateEvents();
      }
      setDeleteModal(false);
    })
  };

  useEffect(() =>
  {
    const confirmAttendance = () => 
    {
      fetch(`/api/is/attending/${props.id}/${props.currentUser.id}` , {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => 
        {
          setAttending(data.attending);
        }
      );
    }

    // Find out if the user is attending this event or not
    confirmAttendance();
  }, []);

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
              <h3>Location: {location}</h3>
            </div>
  
            <p>
              <FaUserGroup style={{ margin: "0 5px 0 0" }} /> {props.attendees}
            </p>
          </div>
        </div>
  
        <div className="HomeEventBottom">
          <div className="HorizontalSeparator" />
          <div className="HomeEventDescriptionArea">
                <p>{description}</p>
          </div>
          <Accordion
            sx={{
              "&:before": {
                display: "none",
              },
              borderRadius: "4px",
            }}
            slotProps={{ transition: {unmountOnExit: true} }}
            disableGutters={true}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3> Details </h3>
            </AccordionSummary>
            <AccordionDetails>
              <EventDetails
                startDate={props.startDate}
                endDate={props.endDate}
                joinDeadline={props.joinDeadline}
                tickets={props.tickets}
                ticketsSold={ticketsSold}
                price={props.price}
                paymentDate={props.paymentDate}
                attendees={props.attendees}
              />
            </AccordionDetails>
          </Accordion>
          <div className='HomeEventAttendanceButtonsArea'>
            <div>
              {props.admin && 
                (
                  <div>
                    <Button className='EditEventButton' variant='contained' disabled={dayjs(endDate) < new Date()} onClick={editOnClick} >Edit</Button>
                    <Button className='DeleteEventButton' variant='contained' disabled={ticketsSold > 0} onClick={deleteOnClick} >Delete</Button>
                  </div>
                )
              }
            </div>
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
        // visible
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
          saveEditedEventOnClick={saveEditedEventOnClick}
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
          joinDeadline={joinDeadline}
          price={price}
        />

        <DeleteEventModal
          deleteModal={deleteModal}
          attendees={props.attendees}
          cancelDeleteOnClick={cancelDeleteOnClick}
          confirmDeleteOnClick={confirmDeleteOnClick}
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
        <ToastContainer />
      </div>
    );
}

export default EventItem;