/*
File: TicketItem.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: EventItem.js
Description: This is used to show and use tickets
GitHub: https://github.com/jannejjj/RASP24
*/

import React from 'react';
// Styles
import '../styles/TicketItem.css';
// MUI components
import { Button, Grid} from '@mui/material';
// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
// Modals, components, and commons
import UseTicketModal from '../modals/UseTicketModal';

// Ticket
function TicketItem(props) {

  const [openUseModal, setOpenUseModal] = React.useState(false);

  const localeStringOptions = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Helsinki"
  }

  const localizedTicketDate = new Date(props.ticket.date).toLocaleString("fi-FI", localeStringOptions);

  // Use ticket
  const useTicket = async () => {
    await fetch('/api/ticket/use/' + props.ticket._id, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "Authorization": "Bearer " + props.currentUser.token
      },
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        props.setTicket(data.ticket);
      }
    });
  };

  return (
    <div className='ticket-container'>
      <Grid container className='ticket-background'>
        <Grid item className='ticket-left'>
          <CheckCircleIcon className='checkmark'/>
        </Grid>
        <Grid item className='ticket-right'>
          <span className='ticket-title'> Ticket for <b>{props.title}</b></span>
          <div className='horizontal-separator'/>
          <p className='ticket-date'>Bought on: {localizedTicketDate}</p>
          <p className='ticket-date'>ID: {props.ticket._id}</p>
        </Grid>
        <Grid item className='ticket-button'>
          <Button
            onClick={() => setOpenUseModal(true)}
            variant='contained' color='primary'
            disabled={props.ticket.used}
          > {props.ticket.used ? "Used" : "Use"} </Button>
        </Grid>
      </Grid>

      <UseTicketModal openUseModal={openUseModal} setOpenUseModal={setOpenUseModal} useTicket={useTicket} />

    </div>
  );
}

export default TicketItem;