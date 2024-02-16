import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function EditEventModal(props)
{
    return (
      <Modal open={props.edit} >
        <Box className='ModalBackground' >
          <h2>
            Edit the event
          </h2>
          <div className='HorizontalSeparator' />
          <TextField value={props.editedTitle} onInput={props.handleTitleChange} className='TextField' fullWidth label="Title" />
          <TextField value={props.editedTime} onInput={props.handleTimeChange} className='TextField' fullWidth label="Time" />
          <TextField value={props.editedLocation} onInput={props.handleLocationChange} className='TextField' fullWidth label="Location" />
          <TextField multiline value={props.editedDescription} onInput={props.handleDescriptionChange}
            className='TextField' fullWidth label='Description' maxRows={15} />
          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelEditOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.saveEditOnClick} >Save</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default EditEventModal;