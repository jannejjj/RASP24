import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Members from './components/Members';
import TopBar from './components/TopBar';

function App() {
  return (
    <Router>
      <div className="App">
        <TopBar />
        <Routes>
        <Route path="/members" element={<Members />} />
        </Routes>
      </div>
  </Router>
  );
}

export default App;
