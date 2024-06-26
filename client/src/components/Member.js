/*
File: Member.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: Members.js
Props and Parameters: member("memberSchema"), currentUser("memberSchema")
Description: Member card on the member page
GitHub: https://github.com/jannejjj/RASP24
*/

import React from 'react';
import { useState } from 'react';
// MUI components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { CardMedia } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
// Modals, components, and commons
import ManageMemberModal from '../modals/ManageMemberModal';
// Icons
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/Email';
import { RxCheckCircled } from "react-icons/rx";
import { RxCrossCircled } from "react-icons/rx";


function Member(props) {
  const [openManageMemberModal, setOpenManageMemberModal] = useState(false);

  // Function to convert buffer to base64 URL
  const bufferToDataURL = (buffer, mimeType) => {

    const uint8Array = new Uint8Array(buffer);
      // Convert the Uint8Array to a Base64 string
      const base64String = uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '');
      const imageUrl = `data:${mimeType};base64,${btoa(base64String)}`; 
    return imageUrl;
  };

  const imageUrl = props.profilePicture
    ? bufferToDataURL(props.profilePicture.buffer.data, props.profilePicture.mimetype) 
    : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';

  // Delete the memner from the association
  const deleteMember = async () =>
  {
    fetch('/api/delete/member/' + props.member._id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.currentUser.token,
      }
    })
    .then(response => response.json())
    .then(data => 
      {
        if (!data.success) 
        {
          console.log("Error while deleting member!");
        } 
      }
    );

    props.toggleUpdate();
  }


  // Update the members role and permissions
  const updateMember = async (updatedPermission, updatedRole) =>
  {
    const body =
    {
      role: updatedRole,
      permission: updatedPermission,
      memberID: props.member._id
    };

    fetch("/api/update/member", 
      {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          "Authorization": "Bearer " + props.currentUser.token
        },
        body: JSON.stringify(body),
      }
    )
    .then(response => response.json())
    .then(data => 
      {
        if (!data.success)
        {
          console.log("Error while updating member!");
        }
      }
    );

    props.toggleUpdate();
  }

    const getMemberEmailOnClick = (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(props.member.email);
      props.showToastSuccessMessage('Email "' + props.member.email + '" copied to clipboard.');
  };

  const card = (
    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: "100%"}}>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        <CardMedia 
          component='img'
          sx={{ width: '100px', height: '100px', m: 1, borderRadius: 1}}
          image={imageUrl}
          alt={'Profile picture for ' + props.member.firstname + ' ' + props.member.lastname + '.'}
        />
        <Box sx={{m: 1}}>
          <Typography align='left' variant="h5" sx={{mb: 0.5, display: 'flex'}} color="primary">
            {props.currentUser.admin &&
              (
                props.member.membershipPaid ?
                (
                  <Tooltip title="Membership: ACTIVE!">
                    <IconButton sx={{p: 0.5}}>
                      <RxCheckCircled  style={{fontSize: "25px", color: "#237d3c"}}/>
                    </IconButton>
                  </Tooltip>
                )
                :
                (
                  <Tooltip title="Membership: INACTIVE!">
                    <IconButton sx={{p: 0.5}}>
                      <RxCrossCircled  style={{fontSize: "25px", color: "#8c1c1c"}}/>
                    </IconButton>
                  </Tooltip>
                )
              )
            }   
            {props.member.firstname} {props.member.lastname} <span className='MemberRole'>{props.member.role}</span>
          </Typography>
          <Box sx={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Typography align='left' color="text.secondary">
              {props.member.email}
          </Typography>
          <IconButton aria-label="getEmail" onClick={getMemberEmailOnClick}>
              <EmailIcon />
          </IconButton>
          </Box>
          
          <Typography align='left' color="text.secondary">
              {props.member.phone}
          </Typography>
        </Box>
      </Box>
      {props.currentUser.admin &&
        <Box sx={{display: 'flex', flexDirection: "column", justifyContent: "center", m: 2}}>
          <Stack direction="row" justifyContent="space-between" spacing={5}>
            <Button  sx={{ maxWidth: '110px', maxHeight: '40px', minWidth: '110px', minHeight: '40px'}}  size="medium" variant="contained" onClick={() => setOpenManageMemberModal(true)}>Manage</Button>
          </Stack>
        </Box>
      } 

      <ManageMemberModal
        member={props.member}
        openManageMemberModal={openManageMemberModal}
        setOpenManageMemberModal={setOpenManageMemberModal}
        deleteMember={deleteMember}
        updateMember={updateMember}
        currentUser={props.currentUser}
      />
    </Box>
  );

  return (
    <div>
        <Box sx={{ border: 0, width: '60%', margin: 'auto', mb: 1.5 }}>
            <Card variant="outlined" sx={props.currentUser.id === props.member._id && {border: 1, borderColor: '#2C041C'}}>{card}</Card>
        </Box>
    </div>
  )
}

export default Member