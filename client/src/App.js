/*
File: App.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Description: Handles authentication and routing.
GitHub: https://github.com/jannejjj/RASP24
*/

import { useState, useEffect, useRef } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
// MUI components
import { createTheme, ThemeProvider } from '@mui/material/styles';
// Modals, components, and commons
import Members from './components/Members';
import Home from './components/Home';
import MyProfile from './components/MyProfile';
import News from './components/News';
import TopBar from './components/TopBar';
import Register from './components/Register';
import Login from './components/Login';
import SchedulerComponent from './components/Scheduler';
// Styles
import "react-big-calendar/lib/css/react-big-calendar.css"

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement('script');
  script.setAttribute('async', '');
  script.setAttribute('id', id);
  script.src = src;
  position.appendChild(script);
}

function App() {
  const [loading, setLoading] = useState(false);
  const googleLoaded = useRef(false);
  const [currentUser, setCurrentUser] = useState({
    admin: false,
    loggedIn: false,
    firstname: "",
    lastname: "",
    token: "",
    id: null
  });

  const theme = createTheme(
    {
      typography:
      {
        fontFamily: "Poppins"
      },
      palette:
      {
        primary:
        {
          main: "#2C041C"
        },
        action:
        {
          disabled: '#85717c'
        }
      }    
    }
  );

  /* Load Google Maps API */
  if (typeof window !== 'undefined' && !googleLoaded.current) {
    setLoading(true);
    if (!document.querySelector('#google-maps')) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_API_KEY}&region=EN&language=en&libraries=places,marker&loading=async`,
        document.querySelector('head'),
        'google-maps',
      );
    }
    googleLoaded.current = true;
    setLoading(false);
  }

  /* Authenticate user */
  useEffect(() =>
  {
    const tokenFromStorage = localStorage.getItem("AssocEase_Token");
    async function authenticate()
    {
      setLoading(true);
      await fetch("/api/authenticate/token", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ token: tokenFromStorage }),
      })
        .then((response) => response.json())
        .then((data) =>
        {
          if (data.success)
          {
            setCurrentUser({
              admin: data.admin,
              loggedIn: true,
              token: tokenFromStorage,
              firstname: data.firstname,
              lastname: data.lastname,
              id: data.id,
            });
          }
        });
      setLoading(false);
    }
    if (tokenFromStorage !== null)
    {
      authenticate();
    }
  }, []);

  if (!loading) return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <Routes>
          <Route path="/Members" element={<Members currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/Scheduler" element={<SchedulerComponent currentUser={currentUser}/>} />
          <Route path="/News" element={<News currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/" element={<Home currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          {/* If the user is not logged in and they go to the MyProfile url, they are rerouted to the home page */}
          <Route path="/MyProfile" element={currentUser.loggedIn ? ( <MyProfile currentUser={currentUser} setCurrentUser={setCurrentUser} /> ) : ( <Home currentUser={currentUser} setCurrentUser={setCurrentUser} /> )} />
          <Route path="/Register" element={<Register currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          <Route path="/Login" element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
          </Routes>
          <div className='Footer'>
            <p>AssocEase &copy;</p>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
