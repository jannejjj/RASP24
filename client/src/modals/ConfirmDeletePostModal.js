import '../styles/Modals.css';
import React from 'react';
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';

function ConfirmDeletePostModal(props)
{
    return (
      <Modal open={props.openConfirmModal}>
        <Box className='ModalBackground' style={{width: "370px"}}>
          <Typography>
            Are you sure you want to delete the post?
          </Typography>
          <div className='HorizontalSeparator' />
          <div className='ModalButtonArea'>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {props.setOpenConfirmModal(false)}} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.deletePost} >Delete</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default ConfirmDeletePostModal;