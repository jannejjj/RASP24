import {React, useState} from 'react'
import "../styles/HomePage.css";
import Button from '@mui/material/Button';
import { FaUserGroup } from "react-icons/fa6";
import TextField from '@mui/material/TextField';

function Details(params) {
  const ManageOnClickManage = () => {
    setmanageDetails(true)
    setDetailsHistory(details)
  }
  const ManageOnClickSave = () => {
    setmanageDetails(false)
    console.log(details)
  }
  const ManageOnClickCancel = () => {
    setmanageDetails(false)
    setDetails(detailsHistory)
  }
  const handleDetailsChange = (event) => {
    setDetails(event.target.value)
  }

  const [admin, setAdmin] = useState(true)
  const [details, setDetails] = useState("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse mollis imperdiet est, ut maximus est lobortis non. Aliquam bibendum venenatis mi, a auctor lacus interdum feugiat. Aenean nec leo a diam iaculis iaculis. Vestibulum cursus tincidunt neque, quis euismod dolor tincidunt ac.")
  const [manageDetails, setmanageDetails] = useState(false)
  const [detailsHistory, setDetailsHistory] = useState("")


  return(
    <div className='Details'>
      <div className='Backround'>
        <div className='Header'>
          <h2>
            Details
          </h2>
          <p>
            <FaUserGroup className='FaUserGroup'/> 123 members
          </p>
        </div>
        <div className='HorizontalSeparator' />
        <div className='Text'>
        <TextField
          multiline
          fullWidth
          maxRows={20}
          disabled = {!manageDetails}
          value = {details}
          onInput= {handleDetailsChange}
          wrap = "soft"
          variant="standard"
            InputProps={{
            disableUnderline: true,
            }}
          sx={{
            "& .MuiInputBase-input.Mui-disabled": {
              WebkitTextFillColor: "#222222",
          },
          }}
          />
          {admin && (
            <div>
              {!manageDetails ? (
                <Button variant="outlined" color="primary" onClick={ManageOnClickManage}>
                Manage
                </Button>
              )
              :
              (
                <div className='Buttons'>
                  <Button variant="outlined" color="success" onClick={ManageOnClickSave}>
                  Save
                  </Button>
                  <Button variant="outlined" color="error" onClick={ManageOnClickCancel}>
                  Cancel
                  </Button>
                </div>
              )}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}


function Home() {
  
  return (
    <div className='HomePageBackground'>
      <h1>Association Ry</h1>
      <Details/>
      <div>
      
      </div>
    </div>
  )
}

export default Home