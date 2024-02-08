import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Members from './components/Members';
import Home from './components/Home';
import MyProfile from './components/MyProfile';
import TopBar from './components/TopBar';
import Register from './components/Register';
import Login from './components/Login';

function App() {
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
        }
      }    
    }
  );

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <TopBar />
          <Routes>
          <Route path="/members" element={<Members />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/myprofile" element={<MyProfile />} />
          <Route path="/Register" element={<Register />} />
          <Route path="/Login" element={<Login />} />
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
