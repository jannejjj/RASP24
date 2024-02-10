import { useNavigate } from "react-router-dom";
import {useState} from 'react'
import OutlinedInput from '@mui/material/OutlinedInput';
import Button from "@mui/material/Button";
import '../styles/Login.css';
import '../App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
    let navigate = useNavigate();

    const [member, setMember] = useState({})
    const [err, setErr] = useState('')

    /* When input fields are being changed, the member object is being updated */
    const whenChanging = (event) => {
      setMember({...member, [event.target.id]: event.target.value})
    }

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
                      sessionStorage.setItem('token', data.token)
                      navigate('/Home');
                  }
              } else {
                  setErr(data.message);
                  showToastMessage(data.message);
              }
          })
  }


    return (
        <div className="LoginBackground">
            <h1>Login</h1>
            <form onSubmit={submitForm} onChange={whenChanging} className='LoginForm' >
                <OutlinedInput fullWidth variant='' required placeholder={'Email'} type="email" id="email" sx={{m: 1}} />
                <OutlinedInput fullWidth variant="outlined" required placeholder={'Password'} type="password" id="password" sx={{m: 1}} />
                <Button variant='contained' color="primary" type="submit" id="submit" sx={{m: 1}}>Login</Button>
            </form>
            <ToastContainer />
        </div>
    )
}

export default Login