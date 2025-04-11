import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";

export default function EditExercise() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    description: "",
    duration: 0,
    date: new Date(),
    users: [],
  });
  const [loading, setLoading] = useState({
    initial: true,
    submission: false,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exerciseRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/exercises/${id}`),
          axios.get("http://localhost:5000/api/users"),
        ]);

        if (!exerciseRes.data) throw new Error("Exercise not found");
        if (!usersRes.data.length) throw new Error("No users available");

        setFormData({
          username: exerciseRes.data.username,
          description: exerciseRes.data.description,
          duration: exerciseRes.data.duration,
          date: new Date(exerciseRes.data.date),
          users: usersRes.data.map((user) => user.username),
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading((prev) => ({ ...prev, initial: false }));
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading((prev) => ({ ...prev, submission: true }));
    setError(null);

    try {
      const updatedExercise = {
        username: formData.username,
        description: formData.description,
        duration: Number(formData.duration),
        date: formData.date,
      };

      await axios.post(
        `http://localhost:5000/api/exercises/update/${id}`,
        updatedExercise
      );
      navigate("/");
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.error || "Failed to update exercise");
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  if (loading.initial) {
    return <div className="text-center mt-5">Loading exercise data...</div>;
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
          <button
            className="btn btn-link"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h3>Edit Exercise Log</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Username:</label>
          <select
            name="username"
            className="form-control"
            value={formData.username}
            onChange={handleChange}
            required
            disabled={loading.submission}
          >
            {formData.users.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Description:</label>
          <input
            name="description"
            type="text"
            className="form-control"
            value={formData.description}
            onChange={handleChange}
            required
            disabled={loading.submission}
          />
        </div>

        <div className="form-group mb-3">
          <label>Duration (minutes):</label>
          <input
            name="duration"
            type="number"
            className="form-control"
            value={formData.duration}
            onChange={handleChange}
            min="1"
            required
            disabled={loading.submission}
          />
        </div>

        <div className="form-group mb-3">
          <label>Date:</label>
          <DatePicker
            selected={formData.date}
            onChange={(date) => setFormData({ ...formData, date })}
            className="form-control"
            disabled={loading.submission}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading.submission}
        >
          {loading.submission ? "Updating..." : "Update Exercise"}
        </button>
      </form>
    </div>
  );
}
