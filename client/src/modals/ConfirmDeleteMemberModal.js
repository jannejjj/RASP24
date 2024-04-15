/*
File: ConfirmDeleteMemberModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: ManageMemberModal.js
Props and Parameters: openConfirmModal, setOpenConfirmModal, deleteMember
Description: A modal to ensure that the user wants to delete a user.
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

function ConfirmDeleteMemberModal(props)
{
    return (
      <Modal open={props.openConfirmModal}>
        <Box className='ModalBackground' style={{width: "370px"}}>
          <Typography>
            Are you sure you want to delete the member?
          </Typography>
          <div className='HorizontalSeparator' />
          <div className='ModalButtonArea'>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {props.setOpenConfirmModal(false)}} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.deleteMember} >Delete</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default ConfirmDeleteMemberModal;