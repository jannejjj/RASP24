import { React, useState, useEffect } from "react";
import "../App.css";
import { Calendar, Views, dayjsLocalizer} from 'react-big-calendar';
import { Button, Grid } from '@mui/material';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import EventItem from "./EventItem";
import "../styles/Scheduler.css";
import "../App.css";
dayjs.extend(timezone);

const localizer = dayjsLocalizer(dayjs);

function SchedulerComponent(props) {
  const [loading, setLoading] = useState(true);
  const [updateEvents, setUpdateEvents] = useState(false);
  const [events, setEvents] = useState([{}]);
  const [calendarEvents, setCalendarEvents] = useState([{}]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const ColoredDateCellWrapper = ({ children }) =>
  React.cloneElement(React.Children.only(children), {
    style: {
      backgroundColor: 'lightblue',
    },
  })

  const traduceEvents = ()=>{
    let temp = [];
    events.map((e,i)=>{
      temp.push({
        title:e.title,
        id: e._id,
        start: new Date(e.startDate),
        end: e.endDate != undefined ? new Date(e.endDate): new Date(e.startDate),
        ref:i
      });
    });
    console.log(temp);
    setCalendarEvents(temp);
  };

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
  }, [updateEvents]);

  useEffect(traduceEvents, [events]);
  const handleOnSelectEvent = (e) => {
    setSelectedEvent(events[e.ref]);
  }
  return (
    <div>
      <Grid container spacing={2} sx={{ mb:1 }} columns={3}>
        <Grid item xs={3} sx={{mt:2}}>
          <h1> Calendar </h1>
        </Grid>
        <Grid item xs={1} sx={{pl:1}}>  
          {selectedEvent !== null ? 
            <EventItem
              currentUser={props.currentUser}
              user={props.currentUser}
              admin={props.currentUser}
              event={selectedEvent}
              showToastMessage={()=>{}}
              showToastSuccessMessage={()=>{}}
              toggleUpdateEvents={()=>{}}
            /> :
            <p>No event selected</p> 
          }
        </Grid>
        <Grid item xs={2} sx={{height:"70vh", p:"16px", pl:"32px",pr:"32px"}}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            onSelectEvent={handleOnSelectEvent}
            startAccessor="start"
            endAccessor="end"
            views={Object.keys(Views).map((k) => Views[k])}
          />
        </Grid>
      </Grid>
    </div>
  );
}

export default SchedulerComponent;