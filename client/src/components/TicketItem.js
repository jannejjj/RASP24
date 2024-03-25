import React from 'react';
import '../styles/TicketItem.css';
import { Button, Grid} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UseTicketModal from '../modals/UseTicketModal';

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