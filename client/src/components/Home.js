import { React, useState } from 'react';
import '../styles/HomePage.css';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { FaUserGroup } from "react-icons/fa6";
import { Typography } from '@mui/material';

function Details(props) {
  const ManageOnClickManage = () => {
    setmanageDetails(true)
    setDetailsHistory(details)
  }
  const ManageOnClickSave = () => {
    setmanageDetails(false)
    console.log(details)
  }
  const ManageOnClickCancel = () => {
    setmanageDetails(false)
    setDetails(detailsHistory)
  }
  const handleDetailsChange = (event) => {
    setDetails(event.target.value)
  }

  const [admin, setAdmin] = useState(props.admin)
  const [details, setDetails] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis imperdiet est, ut maximus est lobortis non. Aliquam bibendum venenatis mi, a auctor lacus interdum feugiat. Aenean nec leo a diam iaculis iaculis. Vestibulum cursus tincidunt neque, quis euismod dolor tincidunt ac.")
  const [manageDetails, setmanageDetails] = useState(false)
  const [detailsHistory, setDetailsHistory] = useState("")


  return(
    <div className='Details'>
      <div className='Backround'>
        <div className='Header'>
          <h2>
            Details
          </h2>
          <p>
            <FaUserGroup className='FaUserGroup'/> 123 members
          </p>
        </div>
        <div className='HorizontalSeparator' />
        <div className='Text'>
        <TextField
          multiline
          fullWidth
          maxRows={20}
          disabled = {!manageDetails}
          value = {details}
          onInput= {handleDetailsChange}
          wrap = "soft"
          variant="standard"
            InputProps={{
            disableUnderline: true,
            }}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#222222",
          },
          }}
          />
          {admin && (
            <div>
              {!manageDetails ? (
                <Button variant="outlined" color="primary" onClick={ManageOnClickManage}>
                Manage
                </Button>
              )
              :
              (
                <div className='Buttons'>
                  <Button variant="outlined" color="success" onClick={ManageOnClickSave}>
                  Save
                  </Button>
                  <Button variant="outlined" color="error" onClick={ManageOnClickCancel}>
                  Cancel
                  </Button>
                </div>
              )}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

function EventItem(props)
{
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
  const [descriptionHistory, setDescriptionHistory] = useState(props.description);

  const editOnClick = () =>
  {
    setEdit(true);
  }

  const saveEditOnClick = () =>
  {
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
  }

  const cancelEditOnClick = () =>
  {
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
  }

  const handleTitleChange = (event) =>
  {
    setEditedTitle(event.target.value);
  }

  const handleTimeChange = (event) =>
  {
    setEditedTime(event.target.value);
  }

  const handleLocationChange = (event) =>
  {
    setEditedLocation(event.target.value);
  }

  const handleDescriptionChange = (event) =>
  {
    setEditedDescription(event.target.value);
  }

  const handleEventAttendance = () =>
  {
    setOpenAttend(false);
    setAttending(true);
    setAttendees(attendees + 1);
  }

  const handleCancelEventAttendance = () =>
  {
    setOpenCancelAttendance(false);
    setAttending(false);
    setAttendees(attendees - 1);
  }

  return (
    <div className='HomeEventItem'>

      <div className='HomeEventTop'>
        <div className='HomeEventPhotoBackground'>
          <img src='https://blogs.lut.fi/newcomers/wp-content/uploads/sites/15/2020/02/talvi-ilma-1-1.jpg' />
        </div>

        <div className='HomeEventHeaderArea'>
          <div className='HomeEventTitleAndLocationArea'>
            <h2>{title}</h2>
            <h3>Created by: {props.creator}</h3>
            <h3>{time}</h3>
            <h3>{location}</h3>
          </div>

          <p><FaUserGroup style={{margin: "0 5px 0 0"}}/> {attendees}</p>
        </div>
      </div>

      <div className='HomeEventBottom'>
        <div className='HorizontalSeparator' />
        <div className='HomeEventDescriptionArea'>
          <p>{description}</p>
        </div>

        <div className='HomeEventAttendanceButtonsArea'>
          {props.admin ? 
            (
              <Button variant='outlined' onClick={editOnClick} >Edit</Button>
            )
            :
            (
              <div>
                {attending ? 
                  (
                    <Button variant='outlined' color='error' onClick={() => {setOpenCancelAttendance(true)}} >Cancel Attendance</Button>
                  )
                  :
                  (
                    <Button variant='outlined' color='success' onClick={() => {setOpenAttend(true)}} >Attend the Event</Button>
                  )
                }
              </div>
            )
          }
        </div>
      </div>
      
      {/* This is the event editing Modal for the admins */}
      <Modal open={edit} >
        <Box className='HomeModalBackground' >
          <h2>
            Edit the event
          </h2>
          <div className='HorizontalSeparator' />
          <TextField value={editedTitle} onInput={handleTitleChange} className='TextField' fullWidth label="Title" />
          <TextField value={editedTime} onInput={handleTimeChange} className='TextField' fullWidth label="Time" />
          <TextField value={editedLocation} onInput={handleLocationChange} className='TextField' fullWidth label="Location" />
          <TextField multiline value={editedDescription} onInput={handleDescriptionChange}
            className='TextField' fullWidth label='Description' maxRows={15} />
          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={cancelEditOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='success' variant='outlined' fullWidth onClick={saveEditOnClick} >Save</Button>
          </div>
        </Box>
      </Modal>

      {/* This is the Modal for accepting the event attendance */}
      <Modal open={openAttend}>
          <Box className='HomeModalBackground'>
            <Typography>
              TODO: Add the logic to attend events
            </Typography>
            <div className='HorizontalSeparator' />

            <div>
              <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {setOpenAttend(false)}} >Cancel</Button>
              <Button style={{margin: "10px 0 0 5px"}} color='success' variant='outlined' fullWidth onClick={handleEventAttendance} >Attend</Button>
            </div>
          </Box>
      </Modal>

      {/* This is the Modal for cancelling the event attendance */}
      <Modal open={openCancelAttendance}>
        <Box className='HomeModalBackground'>
          <Typography>
            TODO: Add the logic to cancel attendance to events
          </Typography>
          <div className='HorizontalSeparator' />

          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {setOpenCancelAttendance(false)}} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='error' variant='outlined' fullWidth onClick={handleCancelEventAttendance} >Cancel Attendace</Button>
          </div>
        </Box>
      </Modal>

    </div>
  )
}

function Home() {
  const [admin, setAdmin] = useState(false);
  const [newEvent, setNewEvent] = useState(false);
  const [events, setEvents] = useState([
    {
      title: "TechSynergy Summit",
      creator: "Emily Thompson",
      time: "26.2.2024 12:00",
      location: "LUT University",
      attendees: 41,
      attending: true,
      description: `The TechSynergy Summit is a premier corporate event designed to bring together industry leaders, visionaries, and innovators in the ever-evolving landscape of technology. This exclusive summit serves as a dynamic platform or collaboration, knowledge exchange, and networking. Attendees can expect insightful keynote presentations, interactive panel discussions, and hands-on workshops that explore the intersection of cutting-edge technologies, fostering an environment where ideas converge, and innovation thrives. Join us at TechSynergy Summit to be at the forefront of the technological revolution and cultivate meaningful connections that propel your organization into the future.`
    },
    {
      title: "FutureTech Showcase",
      creator: "Liam Patel",
      time: "2.4.2024 14:00",
      location: "LUT University",
      attendees: 24,
      attending: false,
      description: `Step into the future with FutureTech Showcase, where cutting-edge innovations and breakthrough technologies converge. Explore the latest advancements in robotics, artificial intelligence, and beyond. Immerse yourself in a curated exhibition that unveils tomorrow's tech landscape today.`
    },
    {
      title: "Digital Nexus Symposium",
      creator: "Sophia Mitchell",
      time: "18.7.2024 10:00",
      location: "LUT University",
      attendees: 98,
      attending: false,
      description: `Join thought leaders and industry experts at the Digital Nexus Symposium, a dynamic gathering that explores the interconnected world of digital technologies. Engage in insightful discussions on the impact of AI, data analytics, and cyber-physical systems. Discover the converging points shaping our digital future at this symposium of ideas and collaboration.`
    }
  ])

  // Data for for the new events
  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleTitleChange = (event) =>
  {
    setNewTitle(event.target.value);
  }

  const handleTimeChange = (event) =>
  {
    setNewTime(event.target.value);
  }

  const handleLocationChange = (event) =>
  {
    setNewLocation(event.target.value);
  }

  const handleDescriptionChange = (event) =>
  {
    setNewDescription(event.target.value);
  }

  const cancelCreationOnClick = () =>
  {
    setNewEvent(false);
    setNewTime("");
    setNewTitle("");
    setNewDescription("");
    setNewLocation("");
  }

  const saveNewEventOnClick = () =>
  {
    // TODO: Send the event data to the server



    // Empty the input fields
    setNewTime("");
    setNewTitle("");
    setNewDescription("");
    setNewLocation("");

    // Close the Modal
    setNewEvent(false);
  }
  return (
    <div className='HomePageBackground'>
      <h1>Association Ry</h1>
      <Details admin={admin}/>
      <div className='HomeEventsList'>
        <h1>Events</h1>
        <div className='HorizontalSeparator'/>
        {admin && (
          <Button color="primary" variant='outlined' onClick={() => {setNewEvent(true)}} style={{margin: "10px 0 10px 0"}} >Add New Event</Button>
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
            description= {event.description}
            key={index}
          />
        ))}
      </div>

      {/* This is the event editing Modal for creating a new event */}
      <Modal open={newEvent} >
        <Box className='HomeModalBackground' >
          <h2>
            Create a new event
          </h2>
          <div className='HorizontalSeparator' />
          <TextField value={newTitle} onInput={handleTitleChange} className='TextField' fullWidth label="Title" />
          <TextField value={newTime} onInput={handleTimeChange} className='TextField' fullWidth label="Time" />
          <TextField value={newLocation} onInput={handleLocationChange} className='TextField' fullWidth label="Location" />
          <TextField multiline value={newDescription} onInput={handleDescriptionChange}
            className='TextField' fullWidth label='Description' maxRows={15} />
          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={cancelCreationOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='success' variant='outlined' fullWidth onClick={saveNewEventOnClick} >Save</Button>
          </div>
        </Box>
      </Modal>
    </div>
  )
}

export default Home