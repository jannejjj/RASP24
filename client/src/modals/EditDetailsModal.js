import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
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
          <TextField value={props.editedFirstname} onInput={props.handleFirstnameChange} className='TextField' fullWidth label="Firstname" />
          <TextField value={props.editedLastname} onInput={props.handleLastnameChange} className='TextField' fullWidth label="Lastname" />
          <TextField value={props.editedPhone} onInput={props.handlePhoneChange} className='TextField' fullWidth label="Phone" />
          <TextField value={props.editedAddress} onInput={props.handleAddressChange} className='TextField' fullWidth label="Address" />
          <TextField value={props.editedPostalcode} onInput={props.handlePostalcodeChange} className='TextField' fullWidth label="Postalcode" />
          <TextField value={props.editedCity} onInput={props.handleCityChange} className='TextField' fullWidth label="City" />
          <TextField value={props.editedCountry} onInput={props.handleCountryChange} className='TextField' fullWidth label="Country" />
          <TextField value={props.editedEmail} onInput={props.handleEmailChange} className='TextField' fullWidth label="Email" />
          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelEditOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='success' variant='outlined' fullWidth onClick={props.saveEditOnClick} >Save</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default EditDetailsModal;