/*
File: EditEventModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: EventItem.js
Description: Allows editing of the event.
GitHub: https://github.com/jannejjj/RASP24
*/

import { React, useState } from "react"; // TODO: useless useState???
// Styles
import '../styles/Modals.css';
import '../styles/HomePage.css';
// MUI components
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import OutlinedInput from '@mui/material/OutlinedInput'; // TODO: useless?
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { TextField } from '@mui/material';
// Modals, components, and commons
import dayjs from 'dayjs';


function EditEventModal(props)
{
    return (
      <Modal open={props.edit} >
        <Box className='ModalBackground' >
          <h2>
            Edit the event
          </h2>
          <form onSubmit={props.saveEditedEventOnClick} onChange={props.whenChanging} className='createNewEventForm' >
                <h1>{props.title}</h1>
                <TextField label='Location' fullWidth required type="text" placeholder={'Location'} id="location" sx={{m: 1}} defaultValue={props.location} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker 
                    onChange={props.handleStartTimeChange}
                    onError={props.handleStartTimeError}
                    label="Select Starting Time" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    defaultValue={dayjs(props.startDate)}
                    sx={{width: '100%'}}
                    slotProps={{
                      textField: {
                        required: true,
                        id: 'startDate',
                        readOnly: true,
                      },
                    }}
                  />
                  <FormControlLabel 
                    control={<Switch checked={props.checkedDeadline}/>}
                    label="Deadline for joining" 
                    onChange={props.handleDeadlineSwitch}
                  />
                  <DateTimePicker
                    onChange={props.handleJoinDeadlineChange}
                    onError={props.handleJoinDeadlineError}
                    disabled={!props.checkedDeadline}
                    label="Event join deadline" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    defaultValue={props.joinDeadline !== undefined ? dayjs(props.joinDeadline):null}
                    value={props.joinDeadline !== undefined ? dayjs(props.joinDeadline):null}
                    sx={{ width: '100%', marginBottom: '10px' }} 
                    slotProps={{
                      textField: {
                        id: 'joinDeadline',
                        readOnly: true,
                      },
                    }}
                  />
                  <DateTimePicker
                    onChange={props.handleEndTimeChange}
                    onError={props.handleEndTimeError}
                    label="Select Ending Time" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    disablePast={true}
                    defaultValue={props.endDate !== undefined ? dayjs(props.endDate):null}
                    sx={{ width: '100%' }} 
                    slotProps={{
                      textField: {
                        id: 'endDate',
                        readOnly: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <TextField fullWidth multiline required label='Description' placeholder={'Description'} type="text" id="description" sx={{m: 1}} defaultValue={props.description}/>
                <TextField fullWidth required label='Price' placeholder={'Price'} type="number"  id="price" inputProps={{min:0,step:0.01}} min="0" sx={{m: 1}} defaultValue={props.price}/>
                <FormControlLabel 
                  control={
                    <Switch checked={props.checkedTicket}/>
                  }
                  label="Limited tickets"
                  onChange={props.resetTickets}
                />
                <TextField 
                  fullWidth 
                  required 
                  disabled={!props.checkedTicket} 
                  label='Number of tickets'
                  placeholder={'Number of tickets'} 
                  min="0" 
                  type="number" 
                  inputProps={{min:0}} 
                  id="tickets" 
                  sx={{m: 1}}
                  value={props.tickets}
                  onChange={e => props.setTickets(e.target.value)}
                />
                <div style={{display:"flex", flexDirection:'row', width:'100%'}}>
                  <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelEditOnClick} >Cancel</Button>
                  <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth type="submit" id="submit" onClick={props.saveEditOnClick} >Save</Button>
                </div>
            </form>
        </Box>
      </Modal>
    )
}

export default EditEventModal;