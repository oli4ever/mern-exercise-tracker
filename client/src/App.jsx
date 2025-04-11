// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Outlet } from "react-router-dom";
// import "bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
// import Navbar from "./components/navbar.component";
// import ExercisesList from "./components/exercises-list.component";
// import EditExercise from "./components/edit-exercise.component";
// import CreateExercise from "./components/create-exercise.component";
// import CreateUser from "./components/create-user.component";

// function App() {
//   return (
//     <Router future={{ v7_startTransition: true }}>
//       <div className="container pt-5">
//         <Navbar />
//         <Outlet />
//         <Routes>
//           <Route path="/" element={<ExercisesList />} />
//           <Route path="/edit/:id" element={<EditExercise />} />
//           <Route path="/create" element={<CreateExercise />} />
//           <Route path="/user" element={<CreateUser />} />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;

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
