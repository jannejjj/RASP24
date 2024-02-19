import React from 'react'
import Event from './Event';
import {useState, useEffect} from 'react';
import Typography from "@mui/material/Typography";

function MyEvents(props) {
  const [events, setEvents] = useState([{}]);
  const [loading, setLoading] = useState(true);

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

  }, [])
  if (loading) {
    return (
        <div>
            <h1>My Events</h1>
            <Typography sx={{ mt: 20 }} variant='h4' align="center">
              Loading...
            </Typography>
        </div>
    )
  }
  if (!props.currentUser.loggedIn) {
    return (
        <div>
            <h1>My Events</h1>
            <Typography sx={{ mt: 20 }} variant='h4' align="center">
              Unauthorized.
            </Typography>
        </div>
    )
  }
  return (
    <div>
      <h1>My Events</h1>
        {[...events].map((event) => (
            <Event key={event._id} event={event}/>
        ))}
      <Typography sx={{ mt: 20 }} variant='h4' align="center">{!events?.length>0 && "No events."}</Typography>
    </div>
  )
}

export default MyEvents