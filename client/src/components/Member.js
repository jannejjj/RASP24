import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { CardMedia, Grid } from '@mui/material';
import { useState } from 'react';
import ManageMemberModal from '../modals/ManageMemberModal';

function Member(props) {
  const [openManageMemberModal, setOpenManageMemberModal] = useState(false);

  // Delete the memner from the association
  const deleteMember = async () =>
  {
    fetch('/api/delete/member/' + props.member.id, {
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
      memberID: props.member.id
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

  const card = (
    <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: "space-between", width: "100%"}}>
      <Box sx={{display: 'flex', flexDirection: 'row'}}>
        <CardMedia 
          component='img'
          sx={{ width: '100px', height: '100px', m: 1, borderRadius: 1}}
          image='https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
          alt={'Profile picture for ' + props.member.firstname + ' ' + props.member.lastname + '.'}
        />
        <Box sx={{m: 1}}>
          <Typography align='left' variant="h5" sx={{mb: 0.5}} color="primary">
              {props.member.firstname} {props.member.lastname} <span className='MemberRole'>{props.member.role}</span>
          </Typography>
          <Typography align='left' color="text.secondary">
          {props.member.email}
          </Typography>
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
      />
    </Box>
  );

  return (
    <div>
        <Box sx={{ border: 0, width: '60%', margin: 'auto', mb: 1.5 }}>
            <Card variant="outlined" sx={{p: 0, m: 0}}>{card}</Card>
        </Box>
    </div>
  )
}

export default Member