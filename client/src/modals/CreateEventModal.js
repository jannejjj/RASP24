import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'dayjs';


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
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
            onChange={props.handleTimeChange}
            label="Select Starting Time" 
            views={['day', 'month', 'year', 'hours', 'minutes']} 
            format="DD/MM/YYYY hh:mm"
            ampm={false}
            disablePast={true}
            />
          </LocalizationProvider>
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