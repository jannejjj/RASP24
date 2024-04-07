/*
File: ManageMemberModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: Member.js
Description: Allows the user to control the member's role and admin status.
GitHub: https://github.com/jannejjj/RASP24
*/

import React, { useState } from 'react';
// Styles
import '../styles/Modals.css';
// MUI components
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { TextField, Typography } from '@mui/material';
// Modals, components, and commons
import ConfirmDeleteMemberModal from './ConfirmDeleteMemberModal';

function ManageMemberModal(props)
{
    // Store the starting values so we know if they have changed
    const [updatedPermission, setUpdatedPermission] = useState(props.member.admin);
    const [updatedRole, setUpdatedRole] = useState(props.member.role);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const handleRoleChange = (event) =>
    {
        setUpdatedRole(event.target.value);
    }

    const handlePermissionUpdate = (event) =>
    {
        setUpdatedPermission(event.target.checked);
    }

    return (
        <Modal open={props.openManageMemberModal}>
            <Box className='ModalBackground'>
                <h2>{props.member.firstname} {props.member.lastname}</h2>
                <div className='HorizontalSeparator' />
                {/* THe user can't delete their own account from the members list. */}
                <Button variant='contained' disabled={props.currentUser.id === props.member._id} onClick={() => setOpenConfirmModal(true)} sx={{width: "100%"}}>Delete Member</Button>
                <TextField variant='outlined' className='TextField' sx={{mb: 1}} label='Role' value={updatedRole} onChange={handleRoleChange} />
                <Box sx={{ border: `1px solid #BDBDBD`, borderRadius: 1, pb: 1, pt: 1, width: "calc(100% - 2px)", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <Typography sx={{ml: 1.5}} color='#757575'>Admin permissions</Typography>
                    <Switch aria-label='Permission switch' checked={updatedPermission} onChange={handlePermissionUpdate} />
                </Box>
                <div className='ModalButtonArea'>
                    <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {props.setOpenManageMemberModal(false)}} >Cancel</Button>
                    <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={() => {props.updateMember(updatedPermission, updatedRole)}} >Update</Button>
                </div>

                <ConfirmDeleteMemberModal openConfirmModal={openConfirmModal} setOpenConfirmModal={setOpenConfirmModal} deleteMember={props.deleteMember} />
            </Box>
        </Modal>
    )
}

export default ManageMemberModal;