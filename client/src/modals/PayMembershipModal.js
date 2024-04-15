/*
File: PayMembershipModal.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: MyProfile.js
Props and Parameters: payMembership, price, paymentDisabled, cancelPaymentOnClick, paymentOnClick
Description: Allows the user to pay membership.
GitHub: https://github.com/jannejjj/RASP24
*/

import React from 'react';
// Styles
import '../styles/Modals.css';
// MUI components
import Modal from '@mui/material/Modal';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';

function PayMembershipModal(props) {
  return (

    <Modal open={props.payMembership}>
      <Box className='ModalBackground' >
        <h2>
          Pay Membership
        </h2>
        <div className='HorizontalSeparator' />
        <h3 style={{fontSize: "40px", textDecoration: "underline", color: "#6a6a6a"}}>{props.price + " €"}</h3>
        <p className='HintParagraphSmall'>* Expires in a year</p>
        <div className='ModalButtonArea'>
          <Button style={{margin: "20px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelPaymentOnClick} >Cancel</Button>
          <Button disabled={props.paymentDisabled} style={{margin: "20px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.paymentOnClick} >Pay</Button>
        </div>
      </Box>

    </Modal>
    
  )
}

export default PayMembershipModal;