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