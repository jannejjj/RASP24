import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
import Button from "@mui/material/Button";
import { Input } from '@mui/material';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

function UploadImageModal(props)
{
    return (
      <Modal open={props.upload} >
        <Box className='ModalBackground' >
          <h2>
            Upload profile image
          </h2>
          <a>The maximum size is 2MB</a>
          <div>
            <Input style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth type="file" onChange={props.handleImageChange} />
            <div className='ModalButtonArea'>
            <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelImageOnClick} >Cancel</Button>
            <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.saveImageOnClick} >Save</Button>
          </div>
        </div>
        </Box>
      </Modal>
    )
}

export default UploadImageModal;