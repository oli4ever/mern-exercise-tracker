// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { createBrowserRouter, RouterProvider } from 'react-router-dom'
// import App from "./App.jsx";

// const root = createRoot(document.getElementById("root"));
// root.render(
//   <StrictMode>
//     <App />
//   </StrictMode>
// );

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import ExercisesList from "./components/exercises-list.component";
import EditExercise from "./components/edit-exercise.component";
import CreateExercise from "./components/create-exercise.component";
import CreateUser from "./components/create-user.component";
import "bootstrap/dist/css/bootstrap.min.css";
import { ErrorBoundary } from "react-error-boundary";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <ExercisesList /> },
      { path: "edit/:id", element: <EditExercise /> },
      { path: "create", element: <CreateExercise /> },
      { path: "user", element: <CreateUser /> },
    ],
    errorElement: <div>Something went wrong!</div>,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

function ErrorFallback({ error }) {
  return (
    <div className="alert alert-danger">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
    </div>
  );
}

// Wrap your routes with this
<ErrorBoundary FallbackComponent={ErrorFallback}>
  {/* Your routes */}
</ErrorBoundary>;
