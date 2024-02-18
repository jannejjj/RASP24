import React from 'react'
import Event from './Event';
import {useState, useEffect} from 'react';
import Typography from "@mui/material/Typography";

function MyEvents() {
  const [events, setEvents] = useState([{}]);
  const [loading, setLoading] = useState(true);
  /* User is authrorized based on if there is a token in the sessionStorage or not */
  const [authorized, setAuthorized] = useState();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    async function fetchEvents() {
        let url = '/api/events';
        if(sessionStorage.getItem('token')) {
          setAuthorized(true);
          let response = await fetch(url, {headers: {
            "Content-type": "application/json",
            "Authorization": "Bearer " + sessionStorage.getItem('token')
          }});
          let dataJson = await response.json();
          if (mounted) {
              setEvents(dataJson);
              setLoading(false);
          }
        } else {
          setLoading(false);
          setAuthorized(false);
        }  
    }
    fetchEvents();
    return () => {
        mounted = false;
    };

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
  if (!authorized) {
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