import '../styles/Modals.css';
import '../styles/HomePage.css';
import '../App.css';
import { React } from "react";
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

function CreateNewNewsPostModal(props)
{
    return (
      <Modal open={props.newPostModal} >
        <Box className='ModalBackground' >
          <h2>
            Create a new post
          </h2>
          <div className='HorizontalSeparator' />
          <form onSubmit={props.saveNewPostOnClick} onChange={props.whenChanging} className='createNewEventForm' >
                <TextField fullWidth required label={'Title'} inputProps={{ maxLength: 50 }} type="text" id="title" sx={{m: 0.5}} />
                <TextField fullWidth multiline required label={'Text'} type="text" id="text" sx={{m: 0.5}} maxRows={10} />
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

export default CreateNewNewsPostModal;