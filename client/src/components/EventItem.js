import { React, useEffect, useState } from "react";
import "../styles/HomePage.css";
import "../App.css";
import Button from "@mui/material/Button";
import { FaUserGroup } from "react-icons/fa6";
import CancelAttendanceModal from "../modals/CancelAttendanceModal";
import ConfirmAttendanceModal from "../modals/ConfirmAttendanceModal";
import EditEventModal from "../modals/EditEventModal";
import DeleteEventModal from "../modals/DeleteEventModal";
import PaymentModal from "../modals/PaymentModal";
import Typography from "@mui/material/Typography";

function EventItem(props) {
  // These states store the original event data
  const [attending, setAttending] = useState(props.attending);
  const [title, setTitle] = useState(props.title);
  const [time, setTime] = useState(props.time);
  const [location, setLocation] = useState(props.location);
  const [description, setDescription] = useState(props.description);
  const [ticketsSold, setTicketsSold] = useState(props.ticketsSold);
  const [tickets, setTickets] = useState(props.tickets);
  const [price, setPrice] = useState(props.price);
  const [hasTicket, setHasTicket] = useState(false);

  // These states store the data that is edited
  const [edit, setEdit] = useState(false);
  const [openAttend, setOpenAttend] = useState(false);
  const [openCancelAttendance, setOpenCancelAttendance] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
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

  useEffect(() => {
    const data = {
      userId: props.user_id,
      eventId: props.id
    };

    fetch('/api/test', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + props.token
        },
          body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
      setHasTicket(data.ticket);
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

  const handlePayment = async (e) => {
    e.preventDefault()

    setOpenPayment(false);

    const data = {
      userId: props.user_id,
      eventId: props.id
    };

    try {
      const response = await fetch('/api/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": "Bearer " + props.token
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorMessage = await response.json(); 
        props.showToastMessage(errorMessage.error);
        throw new Error('Payment failed');
      }

      // Handle success
      console.log('Data submitted successfully');
      props.showToastSuccessMessage("Payment ok");
      setHasTicket(true);
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
              <h3>{time}</h3>
              <h3>{location}</h3>
              {price && <h3>Ticket price: {price}€</h3>}
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
  
          <div className='HomeEventAttendanceButtonsArea'>
            <div>
              {props.admin && 
                (
                  <div>
                    <Button className='EditEventButton' variant='contained' onClick={editOnClick} >Edit</Button>
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
            <div>
              {hasTicket ? (
                <div>You have a ticket </div>
              ) : (
                <div>
                  {typeof tickets === 'undefined' || tickets - ticketsSold > 0 ? (
                    <Button variant='contained' color='primary' onClick={() => {setOpenPayment(true)}} >Buy a ticket</Button>
                  ) : (
                    <div>No tickets available</div>
                  )}
                </div>
              )}
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