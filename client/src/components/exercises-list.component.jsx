// import React, { Component } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const Exercise = (props) => (
//   <tr>
//     <td>{props.exercise.username}</td>
//     <td>{props.exercise.description}</td>
//     <td>{props.exercise.duration}</td>
//     <td>{props.exercise.date.substring(0, 10)}</td>
//     <td className="me-2">
//       <Link to={"/edit/" + props.exercise._id}>edit</Link> |
//       <a
//         className="mx-1"
//         href="#"
//         onClick={(e) => {
//           e.preventDefault();
//           props.deleteExercise(props.exercise._id);
//         }}
//       >
//         delete
//       </a>
//     </td>
//   </tr>
// );

// export default class ExercisesList extends Component {
//   constructor(props) {
//     super(props);

//     this.deleteExercise = this.deleteExercise.bind(this);

//     this.state = { exercises: [] };
//   }

//   componentDidMount() {
//     this.fetchExercises();
//   }

//   fetchExercises() {
//     axios
//       .get("http://localhost:5000/api/exercises") // Ensure this matches your backend route
//       .then((response) => {
//         this.setState({ exercises: response.data });
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }

//   deleteExercise(id) {
//     axios
//       .delete(`http://localhost:5000/api/exercises/${id}`) // Ensure this matches
//       .then((response) => {
//         this.setState({
//           exercises: this.state.exercises.filter((el) => el._id !== id),
//         });
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });
//   }

//   exerciseList() {
//     return this.state.exercises.map((currentexercise) => {
//       return (
//         <Exercise
//           exercise={currentexercise}
//           deleteExercise={this.deleteExercise}
//           key={currentexercise._id}
//         />
//       );
//     });
//   }

//   render() {
//     return (
//       <div className="exercise-container mt-5">
//         <h3 className="mt-5 text-margin">Logged Exercises</h3>
//         <div className="table-responsive">
//           <table className="table table-sm table-striped">
//             <thead className="thead-light">
//               <tr>
//                 <th>Username</th>
//                 <th>Description</th>
//                 <th>Duration</th>
//                 <th>Date</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>{this.exerciseList()}</tbody>
//           </table>
//         </div>
//       </div>
//     );
//   }
// }

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Exercise = ({ exercise, deleteExercise }) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.preventDefault();
    if (!window.confirm("Are you sure you want to delete this exercise?")) {
      return;
    }

    setDeleting(true);
    try {
      await deleteExercise(exercise._id);
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <tr>
      <td>{exercise.username}</td>
      <td>{exercise.description}</td>
      <td>{exercise.duration}</td>
      <td>{exercise.date.substring(0, 10)}</td>
      <td className="me-2">
        <Link to={`/edit/${exercise._id}`}>edit</Link> |{" "}
        <a
          href="#"
          onClick={handleDelete}
          style={{ color: deleting ? "gray" : "red" }}
        >
          {deleting ? "Deleting..." : "delete"}
        </a>
      </td>
    </tr>
  );
};

export default function ExercisesList() {
  const [exercises, setExercises] = useState([]);
  const [error, setError] = useState(null);

  const fetchExercises = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/exercises");
      setExercises(response.data);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to load exercises");
    }
  };

  const deleteExercise = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/exercises/${id}`);
      setExercises(exercises.filter((el) => el._id !== id));
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to delete exercise");
      throw err; // Re-throw to be caught in Exercise component
    }
  };

  React.useEffect(() => {
    fetchExercises();
  }, []);

  return (
    <div className="exercise-container mt-5">
      <h3 className="mt-5 text-margin">Logged Exercises</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="table-responsive">
        <table className="table table-sm table-striped">
          <thead className="thead-light">
            <tr>
              <th>Username</th>
              <th>Description</th>
              <th>Duration</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((exercise) => (
              <Exercise
                key={exercise._id}
                exercise={exercise}
                deleteExercise={deleteExercise}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
