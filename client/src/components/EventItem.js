/*
File: EventItem.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: Home.js, MyProfile.js
Props and Parameters: event("eventSchema"), user("memberSchema"), currentUser, admin, key, showToastMessage, showToastSuccessMessage, toggleUpdateEvents
Description: Event box used on the homepage and in my profile page
GitHub: https://github.com/jannejjj/RASP24
*/

import { React, useEffect, useState } from "react";
import dayjs from 'dayjs';
// Styles
import "../styles/HomePage.css";
import '../styles/EventItem.css';
import "../App.css";
// MUI components
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Accordion, AccordionDetails, AccordionSummary, Tooltip } from "@mui/material";
// Modals, components, and commons
import EditEventModal from "../modals/EditEventModal";
import DeleteEventModal from "../modals/DeleteEventModal";
import ListModal from "../modals/ListModal";
import PaymentModal from "../modals/PaymentModal";
import EventDetails from "./EventDetails";
import TicketItem from "./TicketItem";
import toasts from "../common/Toast";
// Icons
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Event box
function EventItem(props) {

  const [editedEvent, setEditedEvent] = useState({});
  const [startTimeError, setStartTimeError] = useState(false);
  const [endTimeError, setEndTimeError] = useState(false);
  const [joinDeadlineError, setJoinDeadlineError] = useState(false);

  // These states store the original event data
  const [like, setLiking] = useState(null);
  const [likes, setLikes] = useState(props.event.attendees);
  const [title, setTitle] = useState(props.event.title);
  const [location, setLocation] = useState(props.event.location);
  const [description, setDescription] = useState(props.event.description);
  const [ticketsSold, setTicketsSold] = useState(props.event.ticketsSold);
  const [tickets, setTickets] = useState(props.event.tickets);
  const [price, setPrice] = useState(props.event.price);
  const [startDate, setStartDate] = useState(props.event.startDate);
  const [endDate, setEndDate] = useState(props.event.endDate);
  const [joinDeadline, setJoinDeadline] = useState(props.event.joinDeadline);
  const [checkedTicket, setCheckedTicket] = useState(props.event.tickets !== 0 && props.event.tickets !== null && props.event.tickets !== undefined);
  const [checkedDeadline, setCheckedDeadline] = useState(props.event.joinDeadline !== null && props.event.joinDeadline !== undefined);
  const [hasTicket, setHasTicket] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [image, setImage] = useState("https://blogs.lut.fi/newcomers/wp-content/uploads/sites/15/2020/02/talvi-ilma-1-1.jpg");
  const [selectedFile, setSelectedFile] = useState(null);
  const [eventParticipantsData, setEventParticipantsData] = useState(null);

  // These states store the data that is edited
  const [edit, setEdit] = useState(false);
  const [openParticipantsList, setOpenParticipantsList] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.event.title);
  const [editedTime, setEditedTime] = useState(props.event.time);
  const [editedLocation, setEditedLocation] = useState(props.event.location);
  const [editedDescription, setEditedDescription] = useState(props.event.description);
  const [ticketSwitchWasToggled, setTicketSwitchWasToggled] = useState(false);
  const [deadlineSwitchWasToggled, setDeadlineSwitchWasToggled] = useState(false);

  const [loadingLike, setLoadingLike] = useState(true);
  const [loadingTicket, setLoadingTicket] = useState(true);

  const fetchEventImage = async ()=>{
    try {
      const response = await fetch(`/api/getImage/${props.event._id}`); 
      if(response.ok){
        const imageData = await response.json(); 

      // Convert the data array to a Uint8Array
      const uint8Array = new Uint8Array(imageData.buffer.data);

      // Convert the Uint8Array to a Base64 string
      const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
      const imageUrl = `data:${imageData.mimetype};base64,${btoa(base64String)}`; 
      setImage(imageUrl);
      }
      else{
      setImage("https://blogs.lut.fi/newcomers/wp-content/uploads/sites/15/2020/02/talvi-ilma-1-1.jpg");
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  useEffect(() => {
    setLikes(props.event.attendees);
    setTitle(props.event.title);
    setLocation(props.event.location);
    setDescription(props.event.description);
    setTicketsSold(props.event.ticketsSold);
    setTickets(props.event.tickets);
    setPrice(props.event.price);

    setStartDate(props.event.startDate);
    setEndDate(props.event.endDate);
    setJoinDeadline(props.event.joinDeadline);

    // Fetches the profile image of the current event 
    fetchEventImage();

    const confirmLike = () => 
    {
      fetch(`/api/is/attending/${props.event._id}/${props.currentUser.id}` , {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => 
        {
          setLiking(data.attending);
          setLoadingLike(false);
        }
      );
    }

    // Find out if the user is like this event or not
    confirmLike();

  }, [props.event]);

  useEffect(() => {
    const checkTicket = async () => {
      try {
        const response = await fetch(`/api/has/ticket/${props.event._id}/${props.currentUser.id}` , {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + props.currentUser.token,
          }
        });
        const responseData = await response.json();
        if(responseData) {
          if(responseData.hasTicket) {
            setTicket(responseData.ticket);
          }
          setHasTicket(responseData.hasTicket);
          setLoadingTicket(false);
        }
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      }
    }
    checkTicket();
  }, [props.event]);

  // State for event deletion modal
  const [deleteModal, setDeleteModal] = useState(false);
 
  useEffect(() => { 
    const fetchEventData = async () => {
      try {
        const response = await fetch(`api/event/participants/${props.event._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + props.currentUser.token,
          }
        });
        const responseData = await response.json();
        if (responseData && responseData.data && Array.isArray(responseData.data)) {
          setEventParticipantsData(responseData.data);
        } else {
          setEventParticipantsData(null);
        }
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };
    fetchEventData();

  }, [hasTicket]); // If the user buys a ticket, the information is retrieved again

  const openListOnClick = () => {
    setOpenParticipantsList(true);
  };
  const closeListOnClick = () => {
    setOpenParticipantsList(false);
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
  } else if (!editedEvent.joinDeadline) return savingErrorMessages[2];
  if(!checkedTicket) editedEvent.tickets = undefined;
  const startDateAux = new Date(editedEvent.startDate);
  const joinDeadlineAux = new Date(editedEvent.joinDeadline);
  const endDateAux = new Date(editedEvent.endDate);

  if(joinDeadlineError || (editedEvent.joinDeadline !== undefined && joinDeadlineAux > startDateAux))return savingErrorMessages[2];
  if(editedEvent.endDate && startDateAux >= endDateAux) return savingErrorMessages[3];
  return "";
};

  const saveEditedEventOnClick = async (e) => {
    e.preventDefault();
    let errorMessage = savingRules();
    if (errorMessage !== ""){
      toasts.showToastMessage(errorMessage);
      return;
    }

    if(!checkedDeadline) {
      editedEvent.joinDeadline = undefined;
    }
    if(selectedFile){
      if (selectedFile.type !== 'image/png' && selectedFile.type !== 'image/jpeg') {
        toasts.showToastMessage('Please select a PNG or JPEG image file.');
        return;
      }
      //save the image
      const formData = new FormData();
      formData.append('image', selectedFile);
      const response = await fetch(`/api/updateImage/${props.event._id}`, {
        method: 'POST',
        body: formData
      });
      if(response.ok){
        const imageData = await response.json(); 
  
        // Convert the data array to a Uint8Array
        const uint8Array = new Uint8Array(imageData.buffer.data);
  
        // Convert the Uint8Array to a Base64 string
        const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
        const imageUrl = `data:${imageData.mimetype};base64,${btoa(base64String)}`; 
        setImage(imageUrl); 
      }
      else{
        if(response.status === 413){
          toasts.showToastMessage('The image size is too big');
          return;
        }
      }
    }


    editedEvent.creator = props.currentUser.firstname + " " + props.currentUser.lastname;
    editedEvent.creatorId = props.currentUser.id;
    editedEvent.id = props.event._id;
    setEditedEvent(editedEvent);
    fetch("/api/editEvent", {
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
          toasts.showToastMessage(errorMessage);
          return;
        }
        return response.json();
    } )
    .then(data => {
      if (data) {
        // Close the Modal
        setEdit(false);
        props.toggleUpdateEvents();
        if(props.onEditedEvent !== undefined){
          props.onEditedEvent();
        }
        toasts.showToastSuccessMessage("Event edited successfully!");
      }
    });
  };

  const handleTicketSwitch = () => {
    setCheckedTicket(!checkedTicket);
    setTicketSwitchWasToggled(!ticketSwitchWasToggled);
  }

  const handleDeadlineSwitch = () => {
    setCheckedDeadline(!checkedDeadline);
    setDeadlineSwitchWasToggled(!deadlineSwitchWasToggled);
  }

  //Updates the values for the text fields in event edition
  const whenChanging = (event) => {
    setEditedEvent({...editedEvent, [event.target.id]: event.target.value})
  }

  const cancelEditOnClick = () => {
    setEditedEvent({});

    setSelectedFile(null);
    if (ticketSwitchWasToggled) {
      setCheckedTicket(!checkedTicket)
      setTicketSwitchWasToggled(false);

    }
    if(deadlineSwitchWasToggled) {
      setCheckedDeadline(!checkedDeadline);
      setDeadlineSwitchWasToggled(false);
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
    setEditedEvent({...editedEvent, ["joinDeadline"]: value});
  };

  // Triggered if there is an error in the dates
  const handleStartTimeError = (error) => {
    if(error === null) {
      setStartTimeError(false);
    }else{
      setStartTimeError(true);
    }
  }

  const handleEndTimeError = (error) => {
    if (error === null) {
      setEndTimeError(false);
    } else {
      setEndTimeError(true);
    }
}

  const handleJoinDeadlineError = (error) => {
    if (error === null) {
      setJoinDeadlineError(false);
    } else {
      setJoinDeadlineError(true);
    }
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
      price: price,
      tickets : tickets
    });
    setEdit(true);
  };

  const handleTitleChange = (event) => {
    setEditedTitle(event.target.value);
  };

  const handleLocationChange = (value) => {
    if (value === null) {
      return;
    }
    setEditedEvent({...editedEvent, ["location"]: {name: value.structured_formatting.main_text, placeId: value.place_id}});
  }

  const handleDescriptionChange = (event) => {
    setEditedDescription(event.target.value);
  };

  const handleImageChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Post like
  const handleEventLike = async () => {
    const body =
    {
      eventID: props.event._id,
      userID: props.currentUser.id
    };

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

    setLiking(true);
    setLikes(likes + 1);
  };

  // Cancel like
  const handleCancelEventLike = async () => 
  {
    await fetch("/api/cancel/attendance/" + props.event._id + "/" + props.currentUser.id,
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
        setLiking(false);
        setLikes(likes - 1);
      }
    );
  };

  const handlePayment = async (e) => {
    e.preventDefault()

    setOpenPayment(false);

    const data = {
      userId: props.currentUser.id,
      eventId: props.event._id
    };

    try {
      const response = await fetch('/api/ticket/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + props.currentUser.token
        },
        body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          toasts.showToastMessage(data.error);
          throw new Error('Payment failed');
        } else {
          toasts.showToastSuccessMessage("Payment ok!");
          setTicket(data.ticket);
          setHasTicket(true);
          setTicketsSold(ticketsSold + 1);
        }
      });
    } catch (error) {
      // Handle error
      console.error('Error submitting data:', error.message);
    }
  };

  const deleteOnClick = () => {
    setDeleteModal(true);
  };

  const cancelDeleteOnClick = () => {
    setDeleteModal(false);
  };

  // Delete event
  const confirmDeleteOnClick = () => {
    fetch('/api/event/' + props.event._id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.currentUser.token,
      }
    })
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        toasts.showToastMessage(data.error);
      } else {
        toasts.showToastSuccessMessage("Event deleted succesfully!");
        props.toggleUpdateEvents();
        if(props.onDeletedEvent !== undefined){
          props.onDeletedEvent();
        }
      }
      setDeleteModal(false);
    });
  };   

    if(loadingLike || loadingTicket) {
      return null;
    }
    
    return (
      <div className="HomeEventItem">
        <div className="HomeEventTop">
          <div className="HomeEventPhotoBackground">
            <img
              src={image}
              alt="Event"
            />
          </div>
  
          <div className="HomeEventHeaderArea">
            <div className="HomeEventTitleAndLocationArea">
              <h2>{title}</h2>
              <h3>Created by: {props.event.creator}</h3>
              <h3>Location: {location.name}</h3>
            </div>
            <p>
              <FavoriteIcon fontSize="small" sx={{mr:"5px"}}/>  {likes}
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
            disableGutters={true}
            defaultExpanded={props.accordionExpanded}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <h3> Details </h3>
            </AccordionSummary>
            <AccordionDetails>
              <EventDetails
                startDate={props.event.startDate}
                endDate={props.event.endDate}
                joinDeadline={props.event.joinDeadline}
                tickets={tickets}
                ticketsSold={ticketsSold}
                price={price}
                paymentDate={props.event.paymentDate}
                attendees={props.event.attendees}
                placeId={location.placeId}
              />
              {hasTicket && 
                <TicketItem
                  title={title}
                  ticket={ticket}
                  setTicket={setTicket}
                  currentUser={props.currentUser}
                />
              }
            </AccordionDetails>
          </Accordion>
          <div className='HomeEventButtonsArea'>
            <div className="LeftSideButtons">
              {props.currentUser.admin && 
                (
                  <div>
                    {dayjs(endDate) >= new Date() && <Button className='EditEventButton' variant='contained' onClick={editOnClick} >Edit</Button>}
                    {(ticketsSold === 0 || props.oldEvent === true) && <Button className='DeleteEventButton' variant='contained' onClick={deleteOnClick} >Delete</Button>}
                    <Tooltip title={"List of event participants"}>
                      <IconButton className="ListParticipantsButton" onClick={openListOnClick}>
                        <PeopleIcon/>
                      </IconButton>
                    </Tooltip>
                  </div>
                )
              }
            </div>
            {props.oldEvent !== true &&
              <div className="RightSideButtons">
                {like ? 
                  (
                    <IconButton sx={{ 
                      border: "1px solid",
                      borderColor: "primary.main",
                      borderRadius: "5px",
                      height: "100%",
                      mr:1,
                      color: 'primary.main'
                      }} onClick={() => {setLiking(false); handleCancelEventLike(); }}>
                      <FavoriteIcon fontSize="small"/>
                    </IconButton>
                  )
                  :
                  ( 
                    <IconButton variant="contained" sx={{ 
                      borderRadius: "5px",
                      height: "100%",
                      border: "1px solid #2C041C",
                      mr:1, 
                      bgcolor:'primary.main', 
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                      color:'white',
                      '&:hover': {
                        backgroundColor: 'primary.main', // Set the background color on hover
                      },
                      }} onClick={() => {setLiking(true); handleEventLike();}} color='white'>
                      <FavoriteIcon fontSize="small" />
                    </IconButton>
                  )
                }
                {hasTicket ? 
                  (
                    <Button variant='outlined' color='primary' sx={{width: '150px'}} >Paid</Button>
                  )
                  :
                  (
                    <div>
                    {typeof tickets !== "undefined" && tickets !== 0 && tickets - ticketsSold <= 0 ?
                      ( 
                        <Button variant='outlined' disabled color='primary' sx={{width: '150px'}} >Sold Out!</Button>
                      )
                      : 
                      (
                        <Button variant='contained' color='primary' sx={{width: '150px'}} onClick={() => {setOpenPayment(true)}} >Buy a ticket</Button>
                      )
                    }
                    </div>
                  )
                }
              </div>
            }
          </div>
        </div>
  
        <EditEventModal
          edit={edit} // Visibility of the modal
          editedDescription={editedDescription}
          editedLocation={editedLocation}
          editedTime={editedTime}
          editedTitle={editedTitle}
          handleTitleChange={handleTitleChange}
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
          handleImageChange={handleImageChange}
          handleJoinDeadlineError={handleJoinDeadlineError}
          handleTicketSwitch={handleTicketSwitch}
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
          attendees={likes}
          cancelDeleteOnClick={cancelDeleteOnClick}
          confirmDeleteOnClick={confirmDeleteOnClick}
        />
      
        <PaymentModal
          openPayment={openPayment}
          setOpenPayment={setOpenPayment}
          handlePayment={handlePayment}
          price={price}
          title={title}
          user={props.user}
        />

        <ListModal
          openParticipantsList={openParticipantsList}
          setOpenParticipantsList={setOpenParticipantsList}
          closeListOnClick={closeListOnClick}
          event={props.event}
          currentUser={props.currentUser}
          eventParticipantsData={eventParticipantsData}
        />
      </div>
    );
}

export default EventItem;