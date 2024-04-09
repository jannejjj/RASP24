/*
File: Login.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: App.js
Props and Parameters: setCurrentUser
Description: Login page
GitHub: https://github.com/jannejjj/RASP24
*/

import { useNavigate } from "react-router-dom";
import {useState} from 'react'
import { ToastContainer, toast } from 'react-toastify';
// MUI components
import OutlinedInput from '@mui/material/OutlinedInput'; // TODO: Useless?
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
// Styles
import '../styles/Login.css';
import '../App.css';
import 'react-toastify/dist/ReactToastify.css';


function Login(props) {
    let navigate = useNavigate();

    const [member, setMember] = useState({})

    /* When input fields are being changed, the member object is being updated */
    const whenChanging = (event) => {
      setMember({...member, [event.target.id]: event.target.value})
    }

    // TODO delete and use only (import toast from "../common/Toast") ???
    const showToastMessage = (message) =>
    {
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

    /* Sends login details to the backend */
    const submitForm = (event) => {
      event.preventDefault()
      fetch("/api/login", {
          method: "POST",
          headers: {
              "Content-type": "application/json"
          },
          body: JSON.stringify(member),
          mode: "cors"
      })
          .then(response => response.json())
          .then(data => {
              if(data.success) {
                  if(data.token) {
                      localStorage.setItem('AssocEase_Token', data.token);
                      props.setCurrentUser(
                        {
                            admin: data.admin,
                            loggedIn: true,
                            token: data.token,
                            id: data.id,
                            firstname: data.firstname,
                            lastname: data.lastname
                        }
                      );
                      navigate('/');
                  }
              } else {
                  showToastMessage(data.message);
              }
          })
  }


    return (
        <div className="LoginBackground">
            <h1>Login</h1>
            <form onSubmit={submitForm} onChange={whenChanging} className='LoginForm' >
                <TextField fullWidth required label="Email" placeholder={'Email'} type="email" id="email" sx={{m: 1}}/>
                <TextField fullWidth required label="Password" placeholder={'Password'} type="password" id="password" sx={{m: 1}}/>
                <Button variant='contained' color="primary" type="submit" id="submit" sx={{m: 1}}>Login</Button>
            </form>
            <p className="HintParagraphBig" style={{margin: "20px 0 0 0"}}>Forgot your password? <a href="">Link</a></p>
            <ToastContainer />
        </div>
    )
}

export default Login