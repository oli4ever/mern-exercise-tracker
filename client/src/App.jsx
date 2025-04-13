import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar.component";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <div className="container pt-5">
      <Navbar />
      <Outlet />
    </div>
  );
}

export default App;
