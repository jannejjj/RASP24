import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Members from './components/Members';


function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/members" element={<Members />} />
        </Routes>
      </div>
  </Router>
  );
}

export default App;
