
import React, { useEffect, createContext, useState } from 'react';
import "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import './Styles/App.css';
import { BrowserRouter as Router, Route, Routes, Swtich, Link, Redirect} from "react-router-dom";
import MainPage from "./pages/index.jsx";

function App() {

  return(
    <Router>
      <Routes>
      <Route path ="/" element={<MainPage/>}/>
      </Routes>
    </Router>
  )
}

export default App;
