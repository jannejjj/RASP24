import '../styles/Modals.css';
import '../styles/HomePage.css';
import React from 'react';
import Button from "@mui/material/Button";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
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

                <div class="Payment">
                    <Button style={{margin: "10px 5px 0 0"}} color='primary' variant='outlined' fullWidth onClick={() => {props.setOpenPayment(false)}} >Cancel</Button>
                    <Button style={{margin: "10px 0 0 5px"}} color='primary' variant='contained' fullWidth onClick={props.handlePayment} >Buy</Button>
                </div>
            </Box>
        </Modal>
    )
}

export default PaymentModal;