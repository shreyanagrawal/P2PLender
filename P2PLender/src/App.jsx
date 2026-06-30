import { useState } from 'react'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import RoleSelection from './components/RoleSelection'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}/>
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/home" element={<Home />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
