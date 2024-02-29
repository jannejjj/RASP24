import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Members from './components/Members';
import Home from './components/Home';
import MyProfile from './components/MyProfile';
import TopBar from './components/TopBar';
import Register from './components/Register';
import Login from './components/Login';
import { useState, useEffect } from 'react';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    admin: false,
    loggedIn: false,
    firstname: "",
    lastname: "",
    token: "",
    id: 0
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

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <TopBar currentUser={currentUser} setCurrentUser={setCurrentUser} />
          <Routes>
          <Route path="/Members" element={<Members currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
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
