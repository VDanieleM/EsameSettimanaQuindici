import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Posts from "./pages/Posts";
import Utenti from "./pages/Utenti";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/utenti" element={<Utenti />} />
      </Routes>
    </Router>
  );
}

export default App;
