import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Members from './components/Members';
import Home from './components/Home';
import MyProfile from './components/MyProfile';
import TopBar from './components/TopBar';
import Register from './components/Register';
import Login from './components/Login';

function App() {
  return (
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
      </div>
  </Router>
  );
}

export default App;
