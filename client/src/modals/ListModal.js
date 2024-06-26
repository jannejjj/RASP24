/*
File: ListModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: EventItem.js
Props and Parameters: eventParticipantsData, openParticipantsList, closeListOnClick
Description: The modal lists the participants of the event.
GitHub: https://github.com/jannejjj/RASP24
*/

import React, { useEffect, useState } from 'react'; // TODO: useless useEffect???
import { ToastContainer, toast } from 'react-toastify'; // TODO: useless ToastContainer???
// Styles
import '../styles/Modals.css';
import '../styles/HomePage.css';
// MUI components
import { Modal, Box, Button } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
// Modals, components, and commons
import GetMemberEmailsModal from '../modals/GetMemberEmailsModal';
// Icons
import EmailIcon from '@mui/icons-material/Email';


function ListModal(props) {
  const [getEmailsModal, setGetEmailsModal] = useState(false);
  const [separator, setSeparator] = useState("");

  const getEmailsModalOnclick = () => {
    setGetEmailsModal(true);
  };

  const getEmailsCancelOnClick = () => {
    setGetEmailsModal(false);
  };

  const handleSeparatorChange = (event) => {
    setSeparator(event.target.value);
  };

  const getEmailsOnClick = (e) => {
    e.preventDefault();
    var allEmails = "";
    props.eventParticipantsData.forEach(function(member, index) {
      allEmails = allEmails + member.member.email;
      if (index !== props.eventParticipantsData.length - 1) {
        allEmails += separator;
      }
    })
    navigator.clipboard.writeText(allEmails);
    showToastSuccessMessage("All emails copied to clipboard");
    setGetEmailsModal(false);
  };

  const showToastSuccessMessage = (message) =>  {
    toast.success(message, {
        position: "top-center",
        autoClose: 6000,
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "dark"
        });
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        showToastSuccessMessage("The email has been copied to clipboard");
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  return (
    <Modal open={props.openParticipantsList}>
      <Box className='ModalBackground'>
        <h2>List of event participants</h2>
        <div className='HorizontalSeparator' />

        {props.eventParticipantsData ? (
          <div className='Participants'>
            {props.eventParticipantsData.map(member => (
              <Card sx={{display: 'flex', mb: 1.5, pl: 1.5, pt: 1, flexDirection: 'column', justifyContent: "space-between"}} fullWidth variant="outlined" key={member.member.email}>
                <Typography align='left' color="primary">
                  {member.member.firstname + " " + member.member.lastname}
                </Typography>
                <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                  <Typography align='left' color="text.secondary">
                      {member.member.email}
                  </Typography>
                  <IconButton aria-label="getEmail" onClick={() => copyToClipboard(member.member.email)}>
                    <EmailIcon />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </div>
        ) : (
          <p>No event participants yet...</p>
        )}


        <div className='ModalButtonArea'>
          <Button style={{ margin: '10px 5px 0 0' }} color='primary' variant='outlined' fullWidth onClick={props.closeListOnClick}>Exit</Button>
          {props.eventParticipantsData && (
            <Button style={{ margin: '10px 0 0 5px' }} color='primary' variant='contained' fullWidth onClick={getEmailsModalOnclick}>Copy all emails</Button>
          )}
        </div>
        
        <GetMemberEmailsModal
        getEmailsModal={getEmailsModal}
        getEmailsCancelOnClick={getEmailsCancelOnClick}
        getEmailsOnClick={getEmailsOnClick}
        handleSeparatorChange={handleSeparatorChange}
        />
        
      </Box>
    </Modal>
  );
}

export default ListModal;
