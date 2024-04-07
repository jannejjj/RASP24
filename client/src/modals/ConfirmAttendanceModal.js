/*
File: ConfirmAttendanceModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: TODO: ?
Description: A modal to ensure that the user wants to participate in the event.
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
import { Typography } from '@mui/material';

function ConfirmAttendanceModal(props)
{
    return (
      <Modal open={props.openAttend}>
        <Box className='ModalBackground'>
          <Typography>
            TODO: Add the logic to attend events
          </Typography>
          <div className='HorizontalSeparator' />

          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {props.setOpenAttend(false)}} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.handleEventAttendance} >Attend</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default ConfirmAttendanceModal;