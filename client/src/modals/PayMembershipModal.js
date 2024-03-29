import '../styles/Modals.css';
import React from 'react';
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