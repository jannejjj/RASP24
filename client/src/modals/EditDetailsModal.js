import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function EditDetailsModal(props)
{
    return (
      <Modal open={props.edit} >
        <Box className='ModalBackground' >
          <h2>
            Edit the details
          </h2>
          <div className='HorizontalSeparator' />
          <TextField value={props.title} onInput={props.handleTitleChange} className='TextField' label="Title" />
          <TextField multiline value={props.details} onInput={props.handleDetailsChange}
            className='TextField' fullWidth label='Description' maxRows={15} />
          <div>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelEditOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='success' variant='outlined' fullWidth onClick={props.saveEditOnClick} >Save</Button>
          </div>
        </Box>
      </Modal>
    )
}

export default EditDetailsModal;