/*
File: DeleteEventModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: EventItem.js
Props and Parameters: deleteModal, attendees, cancelDeleteOnClick, confirmDeleteOnClick
Description: This modal is used to confirm that the user wants to delete the event.
GitHub: https://github.com/jannejjj/RASP24
*/

import React from 'react';
// Styles
import '../styles/Modals.css';
import '../styles/HomePage.css';
// MUI components
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
            Are you sure you want to delete this event? It has {props.attendees === 0 ? "no attendees" : props.attendees + " attendees"}.
          </p>
          <div className='ModalButtonArea'>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelDeleteOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.confirmDeleteOnClick} >Delete</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default DeleteEventModal;