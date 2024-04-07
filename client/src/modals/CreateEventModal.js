/*
File: CreateEventModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: Home.js
Description: This modal is used to create events.
GitHub: https://github.com/jannejjj/RASP24
*/

import { React } from "react";
// Styles
import '../styles/Modals.css';
import '../styles/HomePage.css';
import '../App.css';
// MUI components
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function CreateEventModal(props)
{
    return (
      <Modal open={props.newEventModal} >
        <Box className='ModalBackground' >
          <h2>
            Create a new event
          </h2>
          <div className='HorizontalSeparator' />
          <form onSubmit={props.saveNewEventOnClick} onChange={props.whenChanging} className='createNewEventForm' >
                <TextField fullWidth required label={'Title'} inputProps={{ maxLength: 50 }} type="text" id="title" sx={{m: 0.5}} />
                <TextField fullWidth required label={'Location'} type="text" id="location" sx={{m: 0.5}} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker sx={{m: 0.5}}
                    onChange={props.handleStartTimeChange}
                    onError={props.handleStartTimeError}
                    label="Select starting time" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    disablePast={true}
                    slotProps={{
                      openPickerIcon: { fontSize: 'large' },
                      inputAdornment: {sx: {mr: 2}},
                      textField: {
                        required: true,
                        id: 'startDate',
                        readOnly: true,
                      },
                    }}
                  />
                  <FormControlLabel 
                    control={<Switch />}
                    label="Deadline for joining" checkedDeadline={props.checkedDeadline}
                    onChange={props.handleDeadlineSwitch}
                  />
                  <DateTimePicker sx={{m: 0.5}}
                    onChange={props.handleJoinDeadlineChange}
                    onError={props.handleJoinDeadlineError}
                    disabled={!props.checkedDeadline}
                    label="Event joining deadline" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    disablePast={true}
                    slotProps={{
                      openPickerIcon: { fontSize: 'large' },
                      inputAdornment: {sx: {mr: 2}},
                      textField: {
                        id: 'joinDeadline',
                        readOnly: true,
                      },
                    }}
                  />
                  <DateTimePicker sx={{m: 0.5}}
                    onChange={props.handleEndTimeChange}
                    onError={props.handleEndTimeError}
                    label="Select ending time" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    disablePast={true}
                    slotProps={{
                      openPickerIcon: { fontSize: 'large' },
                      inputAdornment: {sx: {mr: 2}},
                      textField: {
                        id: 'endDate',
                        readOnly: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <TextField fullWidth multiline required label={'Description'} type="text" id="description" sx={{m: 0.5}} maxRows={10} />
                <TextField fullWidth required label={'Price'} type="number"  id="price" inputProps={{min:0,step:0.01}} min="0" sx={{m: 0.5}} />
                <FormControlLabel 
                  control={<Switch />}
                  label="Limited tickets" checkedTicket={props.checkedTicket}
                  onChange={props.resetTickets}
                />
                <TextField 
                  sx={{m: 0.5}}
                  fullWidth 
                  required 
                  disabled={!props.checkedTicket} 
                  label={'Number of tickets'} 
                  min="0" 
                  type="number" 
                  inputProps={{min:0}} 
                  id="tickets" 
                  value={props.tickets}
                  onChange={e => props.setTickets(e.target.value)}
                />
                <p className='HintParagraphSmall' >Required *</p>
                <div className='ModalButtonArea'>
                  <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelCreationOnClick} >Cancel</Button>
                  <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth type="submit" id="submit">Save</Button>
                </div>
            </form>
        </Box>
      </Modal>
    )
}

export default CreateEventModal;