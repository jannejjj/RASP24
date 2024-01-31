import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from '@mui/material';
import Box from '@mui/material/Box';

const Register = () => {
    let navigate = useNavigate();

    const [member, setMember] = useState({})
    const [err, setErr] = useState('')

    //Keeps track of the input fields and creates the member object as the fields are being filled.
    const whenChanging = (event) => {
        setMember({...member, [event.target.id]: event.target.value})
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
                if(data.success) {
                    console.log(data);
                    console.log("Success");
                    navigate('/login');
                } else {
                    if(data.errors !== undefined) {
                    if (data.errors[0] !== undefined) {
                        setErr(data.errors[0].msg + " " + data.errors[0].param);
                    } else if (data.errors[1] !== undefined) {
                        setErr(data.errors[1].msg + " " + data.errors[1].param);
                    }
                    } else {
                        setErr(data.message);
                    }
                }
        })
    }

    return (
        <div>
            <Box sx={{ border: 0, width: '60%', margin: 'auto' }}>
                <h1 align='left'>{'Register'}</h1>
            </Box>

        <div>
            <form onSubmit={submitForm} onChange={whenChanging}>
                <Input required={true} placeholder={'First name'} type="text" id="firstname"></Input><br/><br/>
                <Input required={true} placeholder={'Last name'} type="text" id="lastname"></Input><br/><br/>
                <Input required={true} placeholder={'Phone number'} type="text" id="phone"></Input><br/><br/>
                <Input required={true} placeholder={'Address'} type="text" id="address"></Input><br/><br/>
                <Input required={true} placeholder={'Postal code'} type="text" id="postalcode"></Input><br/><br/>
                <Input required={true} placeholder={'City'} type="text" id="city"></Input><br/><br/>
                <Input required={true} placeholder={'Country'} type="text" id="country"></Input><br/><br/>
                <Input required={true} placeholder={'Email'} type="email" id="email"></Input><br/><br/>
                <Input required={true} placeholder={'Password'} type="password" id="password"></Input>
                <Typography sx={{mt: 5}} variant='subtitle1' color='inherit'>
                    {'The password must be 10 characters long, have upper- and lowercase, a number and a symbol.'}
                </Typography>
                
                <br/>
                <Button variant='contained' type="submit" id="submit">{'Register'}</Button>
            </form>
        </div>
        
        {/* If there would be an error with registeration it would be shown here */}
        {err && (<Typography variant='h7' color='red' component='h3' padding={2}>
                   {err}
                </Typography>)}
        
    </div>
    )
}

export default Register