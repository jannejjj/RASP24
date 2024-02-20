import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import '../App.css';
import '../styles/Register.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import validator, { isAlphaLocales } from 'validator';

const Register = () => {
    let navigate = useNavigate();

    const [member, setMember] = useState({})
    const [err, setErr] = useState('')

    // States for storing input validation results
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const [postalValid, setPostalValid] = useState(true);

    //Keeps track of the input fields and creates the member object as the fields are being filled.
    const whenChanging = (event) => {
        setMember({ ...member, [event.target.id]: event.target.value })
    }

    //Sends the member object to server
    const submitForm = (e) => {
        e.preventDefault()

        fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify(member),
            mode: "cors"
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    navigate('/login');
                }
                else {
                    if (data.errors !== undefined) {
                        if (data.errors[0] !== undefined) {
                            setErr(data.errors[0].msg);
                            showToastMessage(data.errors[0].msg);
                        }
                        else if (data.errors[1] !== undefined) {
                            setErr(data.errors[1].msg);
                            showToastMessage(data.errors[1].msg);
                        }
                    }
                    else {
                        setErr(data.message);
                        showToastMessage(data.message);
                    }
                }
            })
    }

    const showToastMessage = (message) => {
        toast.error(message, {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: false,
            pauseOnHover: false,
            draggable: false,
            progress: undefined,
            theme: "dark"
        });
    }

    const validatePhone = (event) => {
        if (event.target.value !== "" && !validator.isMobilePhone(event.target.value)) {
            showToastMessage("Please input a valid phone number.");
            setPhoneValid(false);
        } else {
            setPhoneValid(true);
        }
    }

    const validateEmail = (event) => {
        if (event.target.value !== "" && !validator.isEmail(event.target.value)) {
            showToastMessage("Please input a valid email.");
            setEmailValid(false);
        } else {
            setEmailValid(true);
        }
    }

    const validatePostalCode = (event) => {
        if (event.target.value !== "" && !validator.isPostalCode(event.target.value, "FI")) {
            showToastMessage("Please input a valid postal code.");
            setPostalValid(false);
        } else {
            setPostalValid(true);
        }
    }


    return (
        <div className='RegisterBackground'>
            <h1>Register</h1>

            <form onSubmit={submitForm} onChange={whenChanging} className='RegisterForm' >
                <p className='HintParagraphSmall'>All fields are required.</p>
                <OutlinedInput fullWidth required placeholder={'First name'} type="text" id="firstname" sx={{ m: 1 }} />
                <OutlinedInput fullWidth required placeholder={'Last name'} type="text" id="lastname" sx={{ m: 1 }} />
                <OutlinedInput error={!phoneValid} fullWidth required placeholder={'Phone number'} type="text" id="phone" sx={{ m: 1 }} onBlur={validatePhone} />
                <OutlinedInput fullWidth required placeholder={'Address'} type="text" id="address" sx={{ m: 1 }} />
                <OutlinedInput error={!postalValid} fullWidth required placeholder={'Postal code'} type="text" id="postalcode" sx={{ m: 1 }} onBlur={validatePostalCode} />
                <OutlinedInput fullWidth required placeholder={'City'} type="text" id="city" sx={{ m: 1 }} />
                <OutlinedInput fullWidth required placeholder={'Country'} type="text" id="country" sx={{ m: 1 }} />
                <OutlinedInput error={!emailValid} fullWidth required placeholder={'Email'} type="email" id="email" sx={{ m: 1 }} onBlur={validateEmail} />
                <p className='HintParagraphSmall'>The password must have upper- and lowercase characters, a number, a symbol and be at least 10 characters long.</p>
                <OutlinedInput fullWidth required placeholder={'Password'} type="password" id="password" sx={{ m: 1 }} />
                <Button variant='contained' type="submit" id="submit" sx={{ m: 1 }} >Register</Button>
            </form>

            {/* If there would be an error with registeration it would be shown here */}
            <ToastContainer />
        </div>
    )
}

export default Register