/*
File: EditDetailsModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: TODO: Home.js???, MyProfile.js
Props and Parameters: edit, editedPhone, handlePhoneChange, editedEmail, handleEmailChange, editedAddress, handleAddressChange, editedPostalcode, handlePostalcodeChange, ...
editedCity, handleCityChange, editedCountry, handleCountryChange, cancelEditOnClick, saveEditOnClick
Description: This modal allows the user to edit the user's details.
GitHub: https://github.com/jannejjj/RASP24
*/

// Icons
import React from 'react';
// Styles
import '../styles/Modals.css';
import '../styles/HomePage.css';
// MUI components
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function EditDetailsModal(props)
{
    return (
      <Modal open={props.edit} >
        <Box className='ModalBackground' >
          <h2>
            Edit profile information
          </h2>
          <div className='HorizontalSeparator' />
          <TextField value={props.editedPhone} onInput={props.handlePhoneChange} className='TextField' fullWidth label="Phone" />
          <TextField value={props.editedEmail} onInput={props.handleEmailChange} className='TextField' fullWidth label="Email" />
          <TextField value={props.editedAddress} onInput={props.handleAddressChange} className='TextField' fullWidth label="Address" />
          <TextField value={props.editedPostalcode} onInput={props.handlePostalcodeChange} className='TextField' fullWidth label="Postalcode" />
          <TextField value={props.editedCity} onInput={props.handleCityChange} className='TextField' fullWidth label="City" />
          <TextField value={props.editedCountry} onInput={props.handleCountryChange} className='TextField' fullWidth label="Country" />
          <div className='ModalButtonArea'>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelEditOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.saveEditOnClick} >Save</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default EditDetailsModal;