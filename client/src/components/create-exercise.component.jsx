import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

export default function CreateExercise() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    description: "",
    duration: 0,
    date: new Date(),
    users: [],
  });
  const [loading, setLoading] = useState({
    users: true,
    submission: false,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/users");
        if (response.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            users: response.data.map((user) => user.username),
            username: response.data[0].username,
          }));
        } else {
          setError("No users found. Please add users first.");
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setError("Failed to load user list. Please try again later.");
      } finally {
        setLoading((prev) => ({ ...prev, users: false }));
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "duration" ? Number(value) : value,
    }));
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.description || formData.duration <= 0) {
      setError("Please fill all fields correctly");
      return;
    }

    setLoading((prev) => ({ ...prev, submission: true }));
    setError(null);

    try {
      const exercise = {
        username: formData.username,
        description: formData.description,
        duration: Number(formData.duration),
        date: formData.date.toISOString(),
      };

      await axios.post("http://localhost:5000/api/exercises", exercise);
      navigate("/");
    } catch (err) {
      console.error("Error creating exercise:", err);
      setError(err.response?.data?.error || "Failed to create exercise");
    } finally {
      setLoading((prev) => ({ ...prev, submission: false }));
    }
  };

  if (loading.users) {
    return <div className="text-center mt-5">Loading users...</div>;
  }

  return (
    <div className="container mt-5">
      <h3>Create New Exercise Log</h3>
      {error && <div className="alert alert-danger">{error}</div>}

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
            onChange={handleDateChange}
            className="form-control"
            disabled={loading.submission}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading.submission}
        >
          {loading.submission ? "Creating..." : "Create Exercise"}
        </button>
      </form>
    </div>
  );
}
