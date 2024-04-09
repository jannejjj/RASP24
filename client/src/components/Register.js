/*
File: Register.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: App.js
Props and Parameters: -
Description: Register page
GitHub: https://github.com/jannejjj/RASP24
*/

import {useState} from 'react';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
// MUI components
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Select from '@mui/material/Select';
import { Button, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';  
// Styles CSS
import '../App.css';
import '../styles/Register.css';
import 'react-toastify/dist/ReactToastify.css';
// Modals, components, and commons
import countries from '../common/Countries.js';
import validator from 'validator';

// Registe page
const Register = () => {
    let navigate = useNavigate();

    const [member, setMember] = useState({});
    const [err, setErr] = useState('');

    // States for storing input validation results
    const [emailValid, setEmailValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);
    const [postalValid, setPostalValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);
    
    const countryInitState = countries.filter(c=>c.code=='FI');
    const [countryPhone, setCountryPhone] = useState("");
    const [country, setCountry] = useState(countryInitState);
    

    //Keeps track of the input fields and creates the member object as the fields are being filled.
    const whenChanging = (event) => {
        setMember({ ...member, [event.target.id]: event.target.value });
    };

    //Sends the member object to server
    const submitForm = (e) => {
        e.preventDefault();

        if(member.password !== member.password_confirmation){
          setErr("Password and confirmation aren't equal");
          showToastMessage("Password and confirmation aren't equal");
          setPasswordValid(false);
          return;
        }
        //Updating the Phone number value to concatenate the Country code and the rest
        member.phone = "+" + member.countrycodephone + member.phone;
        member.country = country.label;

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
            });
    };
    
    const handleCountryCodePhoneChange = (event) =>{
      const {
        target: { value },
      } = event;
      if (value === null) setCountryPhone("FI");
      setMember({...member, countrycodephone: countries.filter(c=>c.code==value)[0].phone});
      setCountryPhone(value);
    };

    const handleCountryChange = (newValue) => {
      if (newValue === null) {
        return setCountry(countryInitState);
      }
      const newState = countries.filter(c => c.label==newValue.label);
      return setCountry(...newState);
    };

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
    };

    //Validation Functions 
    const validatePhone = (event) => {
  
        // Only validate if phone number and prefix are not empty
        if (!event.target.value || event.target.value === "" || countryPhone === "") return;

        // Simple numeric and length validation
        if (!validator.isNumeric(event.target.value) || event.target.value.length < 4 || event.target.value.length > 15) {
              showToastMessage("Please input a valid phone number.");
              setPhoneValid(false);
              return false;
        } else {
            setPhoneValid(true);
            return true;
        }
    };

    const validateEmail = (event) => {

        if (!event.target.value || event.target.value === "") return;

        if (!validator.isEmail(event.target.value)) {
            showToastMessage("Please input a valid email.");
            setEmailValid(false);
            return false;
        } else {
            setEmailValid(true);
            return true;
        }
    };

    const validatePostalCode = (event) => {
        // Check if country has been selected
        if (!country || !country.code || !event.target.value || event.target.value === "") return;

        // If validator supports chosen country, validate postal code
        if (validator.isPostalCodeLocales.find((locale) => locale === country.code) !== undefined) {
          if (!validator.isPostalCode(event.target.value, country.code)) {
            showToastMessage("Please input a valid postal code.");
            setPostalValid(false);
            return false;
          } else {
            setPostalValid(true);
            return true;
          }
        } else {
          // If validator does not support chosen country, only validate that postal code is numeric
          if (!validator.isNumeric(event.target.value)) {
            showToastMessage("Please input a valid postal code.");
            setPostalValid(false);
            return false;
          } else {
            setPostalValid(true);
            return true;
          }
        }
    };

    return (
        <div className='RegisterBackground'>
            <h1>Register</h1>
            <form onSubmit={submitForm} onChange={whenChanging} className='RegisterForm' >
                <TextField fullWidth required label="First Name" placeholder={'First name'} type="text" id="firstname" sx={{m: 1}} />
                <TextField fullWidth required label="Last name" placeholder={'Last name'} type="text" id="lastname" sx={{m: 1, mb: 2}} />
                <Grid container spacing={2} sx={{ mb:1 }} columns={2}>
                  <Grid item xs="auto">
                  <Select
                    required
                    id="countryphone"
                    onChange={handleCountryCodePhoneChange}
                    value={countryPhone}
                    displayEmpty={true}
                    renderValue={
                      countryPhone === "" &&
                      (() => (
                        <div
                         style={{
                           color: "#666666",
                          }}
                        >
                          Prefix
                        </div>
                      ))
                   }
                  >
                      {countries.map((c) => (
                        <MenuItem value={c.code} >
                          <Box sx={{ '& > img': { mr: 2, flexShrink: 0 } }} >
                            <img
                              loading="lazy"
                              srcSet={`https://flagcdn.com/w40/${c.code.toLowerCase()}.png 2x`}
                              src={`https://flagcdn.com/w20/${c.code.toLowerCase()}.png`}
                              alt=""
                            />
                            +{c.phone}
                          </Box>
                        </MenuItem>
                        ))
                      }
                    </Select>
                  </Grid>
                  <Grid item xs>
                    <TextField
                      sx={{
                        "& .Mui-disabled": {
                          opacity: 0.25,
                        },
                      }}
                      required
                      disabled={countryPhone === ""}
                      fullWidth
                      error={!phoneValid}
                      label="Phone"
                      id="phone"
                      type="tel"
                      onBlur={validatePhone}></TextField>
                  </Grid>
                  <Grid item xs={2}>
                    <TextField fullWidth required label="Address" placeholder={'Address'} type="text" id="address"/>
                  </Grid>
                  <Grid item xs={2}>
                    <Autocomplete //Litteraly the example given here : https://mui.com/material-ui/react-autocomplete/
                      id="country-select-demo"
                      options={countries}
                      getOptionLabel={(option) => option.label}
                      value={country.code}
                      inputValue={country.label}
                      onChange={(e,v)=>handleCountryChange(v)}
                      renderOption={(props, option) => (
                        <Box component="li" {...props}>
                          {option.label}
                        </Box>
                      )}
                      renderInput={(params) => (
                        <TextField {...params} label="Country" required/>
                      )}
                    />
                  </Grid>
                  <Grid item xs>
                    <TextField error={!postalValid} fullWidth required label="Postal Code" placeholder={'Postal code'} type="text" id="postalcode" onBlur={validatePostalCode}/>
                  </Grid>
                  <Grid item xs>
                    <TextField fullWidth required label="City" placeholder={'City'} type="text" id="city" />
                  </Grid>
                </Grid>
                <TextField error={!emailValid} fullWidth required label="Email" type="email" id="email" sx={{m: 1}} onBlur={validateEmail}/>
                <p className='HintParagraphSmall'>The password must have upper- and lowercase characters, a number, a symbol and be 10 characters long.</p>
                <TextField error={!passwordValid} fullWidth required label="Password" placeholder={'Password'} type="password" id="password" sx={{m: 1}} />
                <TextField error={!passwordValid} fullWidth required label="Confirmation" placeholder={'Confirmation'} type="password" id="password_confirmation" sx={{m: 1}} />
                <Button variant='contained' type="submit" id="submit" sx={{m: 1}} >Register</Button>
            </form>

            <ToastContainer />
        </div>
    ) 
}

export default Register