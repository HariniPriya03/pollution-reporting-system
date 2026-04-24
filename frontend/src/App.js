import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./pages/Home";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/report" element={<Report />} />
                <Route path="/login" element={<Login />} />   
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
            <ToastContainer />
        </Router>
        
    );
}

export default App;