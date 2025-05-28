// import { useState } from 'react'
// import { Route } from "react-router-dom" 

import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Register from "./pages/Register"
import WelcomePage from "./pages/WelcomePage"
import ProtectedRoute from "./components/ProtectedRoute"
import PublicOnlyRoute from "./components/PublicOnlyRoute"
import { AuthProvider} from "./contexts/AuthContext"


function App() {
    return (
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route element={<PublicOnlyRoute/>}>
                <Route path="/" element={<WelcomePage />} />
                <Route path="/login" element={<Login />}/> 
                <Route path="/register" element={<Register />}/>
              </Route>
              <Route element={<ProtectedRoute/>}>
                <Route path="/home" element={<Home />}/> 
              </Route> 
            </Routes>
          </AuthProvider>
        </BrowserRouter>
  )
}

export default App
