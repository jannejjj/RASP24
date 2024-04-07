/*
File: GetMemberEmailsModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: Member.js, ListModal.js
Description: Allows admin to collect all emails.
GitHub: https://github.com/jannejjj/RASP24
*/

import React from 'react';
// Styles
import '../styles/Modals.css';
// MUI components
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function GetMemberEmailsModal(props) {
  return (
    <Modal open={props.getEmailsModal} >
        <Box className='ModalBackground' style={{width: "370px"}}>
          <h2>
            Get all member emails
          </h2>
          <div className='HorizontalSeparator' />
          <form onSubmit={props.getEmailsOnClick} className='createNewEventForm' >
            <TextField fullWidth required label={'Separator'} onChange={props.handleSeparatorChange} inputProps={{ maxLength: 5 }} type="text" id="separator" sx={{m: 0.5}} />
            <div className='ModalButtonArea'>
              <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.getEmailsCancelOnClick} >Cancel</Button>
              <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth type="submit" id="submit">Get emails</Button>
            </div>
          </form> 
        </Box>
      </Modal>
  )
}

export default GetMemberEmailsModal