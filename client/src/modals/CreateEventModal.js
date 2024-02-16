import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function CreateEventModal(props)
{
    return (
      <Modal open={props.newEvent} >
        <Box className='ModalBackground' >
          <h2>
            Create a new event
          </h2>
          <div className='HorizontalSeparator' />
          <TextField value={props.newTitle} onInput={props.handleTitleChange} className='TextField' fullWidth label="Title" />
          <TextField value={props.newTime} onInput={props.handleTimeChange} className='TextField' fullWidth label="Time" />
          <TextField value={props.newLocation} onInput={props.handleLocationChange} className='TextField' fullWidth label="Location" />
          <TextField multiline value={props.newDescription} onInput={props.handleDescriptionChange}
            className='TextField' fullWidth label='Description' maxRows={10} />
          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelCreationOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.saveNewEventOnClick} >Save</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default CreateEventModal;