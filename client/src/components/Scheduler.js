import { React, useState, useEffect, useMemo } from "react";
import "../App.css";
import { Grid } from '@mui/material';
import EventItem from "./EventItem.js";
import "../styles/Scheduler.css";
import "../App.css";
import { ToastContainer } from "react-toastify";
import toasts from "../common/Toast.js";
import Typography from "@mui/material/Typography";
import moment from 'moment';
import { Calendar, Views, momentLocalizer} from 'react-big-calendar';

const localizer = momentLocalizer(moment);

function SchedulerComponent(props) {
  const [updateEvents, setUpdateEvents] = useState(false);
  const [events, setEvents] = useState([{}]);
  const [calendarEvents, setCalendarEvents] = useState([{}]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [user, setUser] = useState();

  const traduceEvents = ()=>{
    let temp = [];
    events.map((e,i)=>{
      temp.push({
        title:e.title,
        id: e._id,
        start: new Date(e.startDate),
        end: e.endDate !== undefined ? new Date(e.endDate): new Date(e.startDate),
        ref:i
      });
    });
    setCalendarEvents(temp);
  };

  // Get user data
  const fetchUserData = async () => {
    try {
      const response = await fetch(`/users/getData/${props.currentUser.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      setUser (await response.json()); 
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  // Fetches events and user data from API
  useEffect(() => {
    let mounted = true;
    async function fetchEvents() {
        let url = '/api/events';
        let response = await fetch(url, {headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        }});
        let dataJson = await response.json();
        if (mounted) {
            setEvents(dataJson);
        }
      }
    
    // Only for users that have logged in
    if (props.currentUser.loggedIn)
    {
      fetchEvents();
      fetchUserData();
      return () => {
          mounted = false;
      };
    }
  }, [updateEvents]);

  useEffect(traduceEvents, [events]);

  const handleOnEditedEvent = () => {
    setSelectedEvent(null);
    setUpdateEvents(!updateEvents);
  }

  const handleOnSelectEvent = (e) => {
      setSelectedEvent(events[e.ref]);
  };
  const handleOnDeletedEvent = ()=>{
    setSelectedEvent(null);
    setUpdateEvents(!updateEvents);
  }

  const { views } = useMemo(
    () => ({
      views: [Views.MONTH, Views.WEEK,Views.DAY],
    }),
    []
  );

  return (
    <div>
      <Grid container sx={{ mb:1 }} columns={5}>
        <Grid item xs={5} sx={{mt: 2, mb: 4}}>
          <h1> Calendar </h1>
        </Grid>
        {!props.currentUser.loggedIn && 
        <Grid item xs={5} sx={{mt:4, mb: 4}}>
        <Typography sx={{ mt: 20 }} variant='h4' align="center">
          Please log in to see the Calendar.</Typography>
        </Grid>
          }
        {props.currentUser.loggedIn && 
        <Grid item xs={2} sx={{pl:1 }} >  
          <div className="SchedulerEventContainer">
            {selectedEvent !== null ? 
              <EventItem
                currentUser={props.currentUser}
                user={user}
                admin={props.currentUser.admin}
                event={selectedEvent}
                accordionExpanded={true}
                showToastMessage={toasts.showToastMessage}
                showToastSuccessMessage={toasts.showToastSuccessMessage}
                toggleUpdateEvents={handleOnEditedEvent}
                onDeletedEvent={handleOnDeletedEvent}
                onEditedEvent={()=>{setUpdateEvents(!updateEvents)}}
              /> :
              <p>No event selected</p> 
              }
          </div>
        </Grid>
        }
        {props.currentUser.loggedIn && 
        <Grid item xs={3} sx={{height:"70vh", p:1, pr:4}}
          >
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            views={views}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleOnSelectEvent}
          />
        </Grid>}
      </Grid>
      <ToastContainer />
    </div>
  );
}

export default SchedulerComponent;