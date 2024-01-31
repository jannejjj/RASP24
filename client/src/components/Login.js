import { useNavigate } from "react-router-dom";
import {useState} from 'react'
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import { Button } from "@mui/material";
import Box from '@mui/material/Box';


function Login() {
    let navigate = useNavigate();

    const [member, setMember] = useState({})
    const [err, setErr] = useState('')

    /* When input fields are being changed, the member object is being updated */
    const whenChanging = (event) => {
      setMember({...member, [event.target.id]: event.target.value})
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
              }
          })
  }


    return (
        <div>
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{'Login'}</h1>
            </Box>

            <div>
                <form onSubmit={submitForm} onChange={whenChanging}>
                    <Input required placeholder={'Email'} type="email" id="email"></Input><br/><br/>
                    <Input required placeholder={'Password'} type="password" id="password"></Input><br/><br/>
                    <Button variant='contained' type="submit" id="submit">{'Login'}</Button>
                </form>
            </div>

            {/* Here is shown the error that was received from the server */}
            {err && (<Typography variant='h7' color='red' component='h3' padding={2}>
                        {err}
                    </Typography>)}
            
        </div>
    )
}

export default Login