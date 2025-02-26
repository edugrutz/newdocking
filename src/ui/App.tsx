import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Docking from './pages/Docking';
import List from './pages/List';
import Viewer from './pages/Viewer';

function App() {

  return (
    <div className='bg-dark text-light vh-100 d-flex flex-column'>
      <Router>
        <Navbar />
        <div className='d-flex flex-grow-1'>
          <aside className='sidebar'>
            <List />
          </aside>
          <main className='content ms-2 w-100 me-3'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/docking" element={<Docking />} />
              <Route path="/viewer" element={<Viewer />} />
            </Routes>
          </main>
        </div>
      </Router>
    </div>
  );
}

export default App;