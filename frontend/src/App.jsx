/*import { Route, Routes, useLocation } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Header from './components/Header';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Contact from './pages/Contact'; // Ensure you import the Contact page
import Userdashboard from './pages/User/Userdashboard';
import Admindashboard from './pages/Admin/Admindashboard';
import Viewerdashboard from './pages/Viewer/Viewerdashboard';



export default function App() {
  const location = useLocation();  // Get the current path from the URL

  return (
    <>
      {/* Conditionally render Header based on the current path *
      {location.pathname !== '/login' && location.pathname !== '/Registration' && location.pathname !== '/Userdashboard' &&location.pathname !=='/Admindashboard' && location.pathname !=='/Viewerdashboard' && <Header />} 
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/User/Userdashboard" element={<Userdashboard />} />
        <Route path="/Admin/Admindashboard" element={<Admindashboard />} />
        <Route path="/Viewer/Viewerdashboard" element={<Viewerdashboard />} />
        {/* Add more routes as needed
      </Routes>
    </>
  );
}*/


import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadDoc from "./pages/UploadDoc";
import Navbar from "./components/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/upload" element={<UploadDoc />} />
      </Routes>
    </>
  );
}

export default App;