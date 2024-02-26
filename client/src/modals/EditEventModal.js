import '../styles/Modals.css';
import '../styles/HomePage.css';
import { React, useState } from "react";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
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
                <OutlinedInput fullWidth required type="text" placeholder={'Location'} id="location" sx={{m: 1}} defaultValue={props.location} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    onChange={props.handleStartTimeChange}
                    onError={props.handleStartTimeError}
                    label="Select Starting Time" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY hh:mm"
                    ampm={false}
                    disablePast={true}
                    defaultValue={dayjs(props.startDate)}
                    slotProps={{
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
                  <DateTimePicker
                    onChange={props.handleJoinDeadlineChange}
                    onError={props.handleJoinDeadlineError}
                    disabled={!props.checkedDeadline}
                    label="Event join deadline" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY hh:mm"
                    ampm={false}
                    disablePast={true}
                    defaultValue={dayjs(props.joinDeadlineDate)}
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
                    format="DD/MM/YYYY hh:mm"
                    ampm={false}
                    disablePast={true}
                    defaultValue={dayjs(props.endDate)}
                    slotProps={{
                      textField: {
                        id: 'endDate',
                        readOnly: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <OutlinedInput fullWidth multiline required placeholder={'Description'} type="text" id="description" sx={{m: 1}} defaultValue={props.description}/>
                <OutlinedInput fullWidth required placeholder={'Price'} type="number"  id="price" inputProps={{min:0,step:0.01}} min="0" sx={{m: 1}} defaultValue={props.price}/>
                <FormControlLabel 
                  control={<Switch />}
                  label="Limited tickets" checkedTicket={props.checkedTicket}
                  onChange={props.resetTickets}
                />
                <OutlinedInput 
                  fullWidth 
                  required 
                  disabled={!props.checkedTicket} 
                  placeholder={'Number of tickets'} 
                  min="0" 
                  type="number" 
                  inputProps={{min:0}} 
                  id="tickets" 
                  sx={{m: 1}}
                  value={props.tickets}
                  onChange={e => props.setTickets(e.target.value)}
                />
                <div>
                  <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelEditOnClick} >Cancel</Button>
                  <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth type="submit" id="submit" onClick={props.saveEditOnClick} >Save</Button>
                </div>
            </form>
        </Box>
      </Modal>
    )
}

export default EditEventModal;