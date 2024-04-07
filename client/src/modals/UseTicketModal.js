/*
File: UseTicketModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: TicketItem.js
Description: Checks that the user definitely wants to use the ticket.
GitHub: https://github.com/jannejjj/RASP24
*/

import React from 'react';
// Styles
import '../styles/Modals.css';
// MUI components
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function UseTicketModal(props)
{
    return (
      <Modal open={props.openUseModal}>
        <Box className='ModalBackground' style={{width: "370px"}}>
          <Typography>
            Are you sure you want to use the ticket?
          </Typography>
          <div className='HorizontalSeparator' />
          <div className='ModalButtonArea'>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => props.setOpenUseModal(false)} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={() => { props.useTicket(); props.setOpenUseModal(false); }}>Use ticket</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default UseTicketModal;