import { React, useEffect, useState } from "react";
import "../styles/HomePage.css";
import '../styles/EventItem.css';
import "../App.css";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import EditEventModal from "../modals/EditEventModal";
import DeleteEventModal from "../modals/DeleteEventModal";
import PaymentModal from "../modals/PaymentModal";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EventDetails from "./EventDetails";
import TicketItem from "./TicketItem";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import toasts from "../common/Toast";

function EventItem(props) {
  // These states store the original event data
  const [like, setLiking] = useState(null);
  const [likes, setLikes] = useState(props.event.attendees);
  const [title, setTitle] = useState(props.event.title);
  const [time, setTime] = useState(props.event.time);
  const [location, setLocation] = useState(props.event.location);
  const [description, setDescription] = useState(props.event.description);
  const [ticketsSold, setTicketsSold] = useState(props.event.ticketsSold);
  const [paid, setPaid] = useState(props.paid);
  const [tickets, setTickets] = useState(props.event.tickets);
  const [price, setPrice] = useState(props.event.price);
  const [hasTicket, setHasTicket] = useState(false);
  const [ticket, setTicket] = useState(null);

  // These states store the data that is edited
  const [edit, setEdit] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.event.title);
  const [editedTime, setEditedTime] = useState(props.event.time);
  const [editedLocation, setEditedLocation] = useState(props.event.location);
  const [editedDescription, setEditedDescription] = useState(props.event.description);

  // Save the history so that the editing can be cancelled
  const [titleHistory, setTitleHistory] = useState(props.event.title);
  const [timeHistory, setTimeHistory] = useState(props.event.time);
  const [locationHistory, setLocationHistory] = useState(props.event.location);
  const [descriptionHistory, setDescriptionHistory] = useState(props.event.description);

  useEffect(() => {
    const data = 
    {
      userId: props.currentUser.id,
      eventId: props.event._id
    };

    fetch('/api/hasTicket', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      if (data.hasTicket) {
        setTicket(data.ticket);
      }
      setHasTicket(data.hasTicket);
    })
    .catch(error => {
        console.error('Error fetching ticket status:', error);
    });
  }, []);

  // State for event deletion modal
  const [deleteModal, setDeleteModal] = useState(false);

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

        // If the user doesn't have a ticket for this event, then update the page.
        if (!hasTicket)
        {
          props.toggleUpdateEvents();
        }
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
        toasts.showToastSuccessMessage(data.message);
        props.toggleUpdateEvents();
      }
      setDeleteModal(false);
    });
  };

  useEffect(() =>
  {
    const confirmLike = () => 
    {
      fetch(`/api/is/attending/${props.event._id}/${props.currentUser.id}` , {
        method: 'GET'
      })
      .then(response => response.json())
      .then(data => 
        {
          setLiking(data.attending);
        }
      );
    }

    // Find out if the user is like this event or not
    confirmLike();
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
              <h3>Created by: {props.event.creator}</h3>
              <h3>Location: {location}</h3>
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
            slotProps={{ transition: {unmountOnExit: true} }}
            disableGutters={true}
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
          <div className='HomeEventLikeButtonsArea'>
            <div>
              {props.currentUser.admin && 
                (
                  <div>
                    <Button className='EditEventButton' variant='contained' onClick={editOnClick} >Edit</Button>
                    <Button className='DeleteEventButton' variant='contained' disabled={ticketsSold > 0} onClick={deleteOnClick} >Delete</Button>
                  </div>
                )
              }
            </div>
            <div style={{display: "flex", flexDirection:"row", justifyContent: "space-between", position:"relative", marginLeft: "20px"}}>
              {like ? 
                (
                  <IconButton sx={{ 
                    border: "1px solid",
                    borderColor: "primary.main",
                    borderRadius: 2, 
                    mr:1,
                    color: 'primary.main'
                     }} onClick={() => {setLiking(false); handleCancelEventLike(); }}>
                    <FavoriteIcon fontSize="small"/>
                  </IconButton>
                )
                :
                ( 
                  <IconButton variant="contained" sx={{ 
                    borderRadius: 2, 
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
                    {typeof tickets !== 'undefined' && tickets - ticketsSold <= 0 ?
                      ( 
                        <div style={{width: '150px', textAlign: "center", height:"100%"}}>No tickets available</div>  
                      ): (
                        <Button variant='contained' color='primary' sx={{width: '150px'}} onClick={() => {setOpenPayment(true)}} >Buy a ticket</Button>
                      )
                    }
                    </div>
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

        <DeleteEventModal
          deleteModal={deleteModal}
          attendees={props.event.attendees}
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
      </div>
    );
}

export default EventItem;