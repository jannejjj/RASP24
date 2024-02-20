import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from "react";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import OutlinedInput from '@mui/material/OutlinedInput';

// TODO: Add required to input fields
function CreateEventModal(props)
{
    return (
      <Modal open={props.newEventModal} >
        <Box className='ModalBackground' >
          <h2>
            Create a new event
          </h2>

          <form onSubmit={props.saveNewEventOnClick} onChange={props.whenChanging} className='createNewEventForm' >
                <OutlinedInput fullWidth required placeholder={'Title'} inputProps={{ maxLength: 50 }} type="text" id="title" sx={{m: 1}} />
                <OutlinedInput fullWidth required placeholder={'Location'} type="text" id="location" sx={{m: 1}} />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    onChange={props.handleStartTimeChange}
                    onError={props.handleStartTimeError}
                    label="Select Starting Time" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY hh:mm"
                    ampm={false}
                    disablePast={true}
                    slotProps={{
                      textField: {
                        required: true,
                        id: 'startDate',
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
                    slotProps={{
                      textField: {
                        id: 'endDate',
                        
                      },
                    }}
                  />
                </LocalizationProvider>
                <OutlinedInput fullWidth multiline required placeholder={'Description'} type="text" id="description" sx={{m: 1}} />
                <OutlinedInput fullWidth multiline required placeholder={'Number of tickets'} type="text" id="tickets_amount" sx={{m: 1}} />
                <div>
                  <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelCreationOnClick} >Cancel</Button>
                  <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth type="submit" id="submit">Save</Button>
                </div>
            </form>
        </Box>
      </Modal>
    )
}

export default CreateEventModal;