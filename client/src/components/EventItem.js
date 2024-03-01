import { React, useState } from "react";
import "../styles/HomePage.css";
import "../App.css";
import Button from "@mui/material/Button";
import { FaUserGroup } from "react-icons/fa6";
import CancelAttendanceModal from "../modals/CancelAttendanceModal";
import ConfirmAttendanceModal from "../modals/ConfirmAttendanceModal";
import EditEventModal from "../modals/EditEventModal";

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

export default EventItem;