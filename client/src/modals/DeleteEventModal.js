import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function DeleteEventModal(props)
{
    return (
      <Modal open={props.deleteModal} >
        <Box className='ModalBackground' >
          <h2>
            Delete event
          </h2>
          <div className='HorizontalSeparator' />
          <p style={{textAlign: "center"}}>
            Are you sure you want to delete this event? It has {props.attendees === 0 ? "no attendees." : props.attendees + " attendees."}.
          </p>
          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelDeleteOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.confirmDeleteOnClick} >Delete</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default DeleteEventModal;