/*
File: PaymentModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: EventItem.js
Description: Allows the user to see payment details and confirm purhace. This should route the user to the third party payment page, but this is not done in this project.
GitHub: https://github.com/jannejjj/RASP24
*/

import React from 'react';
// Styles
import '../styles/Modals.css';
import '../styles/HomePage.css';
// MUI components
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
// Icons
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

function PaymentModal(props)
{
    return (
        <Modal open={props.openPayment} >
            <Box className='ModalBackground PaymentModal' >
                <h1>
                    Ticket purchase
                </h1>
                <div className='HorizontalSeparator' />
                <div className='PaymentDetails'>
                    <div className='PaymentEventDetails'>
                      <div style={{display:"flex", flexDirection:"row"}}>
                        <ConfirmationNumberIcon style={{marginRight:"10px"}}/>
                        <h3>{props.title}</h3>
                      </div>
                        <div className='HorizontalSeparator' />
                        <h3 className='price'>Total: {props.price} €</h3>
                    </div>
                    <div className='PaymentBillingDetails'>
                        <h3>Billing details: </h3>
                        <p>Email: {props.user?.email}</p>
                        <p>Firstname: {props.user?.firstname}</p>
                        <p>Lastname: {props.user?.lastname}</p>
                        <p>Phone: {props.user?.phone}</p>
                        <p>Address: {props.user?.address}</p>
                        <p>Postalcode: {props.user?.postalcode}</p>
                        <p>City: {props.user?.city}</p>
                        <p>Country: {props.user?.country}</p>
                    </div>
                </div>

                <div  className='ModalButtonArea'>
                    <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {props.setOpenPayment(false)}} >Cancel</Button>
                    <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.handlePayment} >Buy</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default PaymentModal;