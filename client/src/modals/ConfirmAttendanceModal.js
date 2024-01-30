import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
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
            <Button style={{margin: "10px 0 0 5px"}} color='success' variant='outlined' fullWidth onClick={props.handleEventAttendance} >Attend</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default ConfirmAttendanceModal;