import { useState } from "react";

function WorkoutForm({ token, onWorkoutCreated }) {
  const [title, setTitle] = useState("");
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const workout = {
      title,
      reps: Number(reps),
      load: Number(load),
    };

    try {
      const response = await fetch("http://localhost:4000/api/workouts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(workout),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Workout toegevoegd:", data);
        setTitle("");
        setReps("");
        setLoad("");
        if (onWorkoutCreated) {
          onWorkoutCreated(data);
        }
      } else {
        setError(data.error || "Error bij het toevoegen van workout");
      }
    } catch (error) {
      setError("Server error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Load (kg)"
        value={load}
        onChange={(e) => setLoad(e.target.value)}
        required
      />
      <button type="submit">Toevoegen</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}

export default WorkoutForm;
