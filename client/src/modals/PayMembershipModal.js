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
        <p>TODO: ADD PAYMENT INFORMATION AND PRICE</p>
        <div className='ModalButtonArea'>
          <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={props.cancelPaymentOnClick} >Cancel</Button>
          <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.paymentOnClick} >Pay</Button>
        </div>
      </Box>

    </Modal>
    
  )
}

export default PayMembershipModal;