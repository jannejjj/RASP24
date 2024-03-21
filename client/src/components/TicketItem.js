import React from 'react';
import '../styles/TicketItem.css';
import { Grid} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function TicketItem(props) {


  return (
    <Grid container className='ticket-background'>
      <Grid item xs={3} className='ticket-left'>
        <CheckCircleIcon className='checkmark'/>
      </Grid>
      <Grid item xs={9} className='ticket-right'>
        <span className='ticket-title'> Ticket for <b>{props.title}</b></span>
        <p className='ticket-date'>Bought at: {props.date}</p>
      </Grid>
    </Grid>
  );
}

export default TicketItem;