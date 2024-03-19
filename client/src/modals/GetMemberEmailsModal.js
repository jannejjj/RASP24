import '../styles/Modals.css';
import React from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function GetMemberEmailsModal(props) {
  return (
    <Modal open={props.getEmailsModal} >
        <Box className='ModalBackground'>
          <h2>
            Edit profile information
          </h2>
          <div className='ModalButtonArea'>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.getEmailsCancelOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.getEmailsOnClick} >Get emails</Button>
          </div>
        </Box>
      </Modal>
  )
}

export default GetMemberEmailsModal