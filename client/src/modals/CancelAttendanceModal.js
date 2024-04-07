/*
File: CancelAttendanceModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: TODO: ?
Description: A modal to check for cancellation
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

function CancelAttendanceModal(props)
{
    return (
      <Modal open={props.openCancelAttendance}>
        <Box className='ModalBackground'>
          <Typography>
            TODO: Add the logic to cancel attendance to events
          </Typography>
          <div className='HorizontalSeparator' />

          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {props.setOpenCancelAttendance(false)}} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.handleCancelEventAttendance} >Cancel Attendace</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default CancelAttendanceModal;