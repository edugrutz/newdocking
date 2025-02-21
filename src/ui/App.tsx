import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './pages/Navbar'
import Docking from './pages/Docking'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='bg-dark text-light vh-100'>
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docking" element={<Docking />} />
      </Routes>
    </Router>
    </div>
  )
}

export default App
