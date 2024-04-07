/*
File: CreateNewNewsPostModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: News.js
Description: This modal is used to create a news post.
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
import TextField from '@mui/material/TextField';

/* Modal with a form that opens when the button for creating a news post is pressed. Submit creates the post. */
function CreateNewNewsPostModal(props)
{
    return (
      <Modal open={props.newPostModal} >
        <Box className='ModalBackground' >
          <h2>
            Create a news post
          </h2>
          <div className='HorizontalSeparator' />
          <form onSubmit={props.saveNewPostOnClick} onChange={props.whenChanging} className='createNewEventForm' >
                <TextField fullWidth required label={'Title'} inputProps={{ maxLength: 50 }} type="text" id="title" sx={{m: 0.5}} />
                <TextField fullWidth multiline required label={'Text'} type="text" id="text" sx={{m: 0.5}} minRows={10} maxRows={20} />
                <p className='HintParagraphSmall' >Required *</p>
                <div className='ModalButtonArea'>
                  <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelCreationOnClick} >Cancel</Button>
                  <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth type="submit" id="submit">Create Post</Button>
                </div>
            </form>
        </Box>
      </Modal>
    )
}

export default CreateNewNewsPostModal;