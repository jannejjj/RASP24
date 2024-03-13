import '../styles/Modals.css';
import '../styles/HomePage.css';
import '../App.css';
import { React } from "react";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import OutlinedInput from '@mui/material/OutlinedInput';
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
                <OutlinedInput fullWidth required placeholder={'Title *'} inputProps={{ maxLength: 50 }} type="text" id="title" sx={{m: 0.5}} />
                <OutlinedInput fullWidth required placeholder={'Location *'} type="text" id="location" sx={{m: 0.5}} />
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
                    label="Event join deadline" 
                    views={['day', 'month', 'year', 'hours', 'minutes']} 
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    disablePast={true}
                    slotProps={{
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
                      textField: {
                        id: 'endDate',
                        readOnly: true,
                      },
                    }}
                  />
                </LocalizationProvider>
                <OutlinedInput fullWidth multiline required placeholder={'Description *'} type="text" id="description" sx={{m: 0.5}} maxRows={10} />
                <OutlinedInput fullWidth required placeholder={'Price *'} type="number"  id="price" inputProps={{min:0,step:0.01}} min="0" sx={{m: 0.5}} />
                <FormControlLabel 
                  control={<Switch />}
                  label="Limited tickets" checkedTicket={props.checkedTicket}
                  onChange={props.resetTickets}
                />
                <OutlinedInput 
                  sx={{m: 0.5}}
                  fullWidth 
                  required 
                  disabled={!props.checkedTicket} 
                  placeholder={'Number of tickets'} 
                  min="0" 
                  type="number" 
                  inputProps={{min:0}} 
                  id="tickets" 
                  value={props.tickets}
                  onChange={e => props.setTickets(e.target.value)}
                />
                <p className='HintParagraphSmall' >Required *</p>
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