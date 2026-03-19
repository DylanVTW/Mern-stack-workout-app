import { useState } from "react";

function WorkoutForm() {
  const [title, setTitle] = useState("");
  const [reps, setReps] = useState("");
  const [load, setLoad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workout = {
      title,
      reps: Number(reps),
      load: Number(load),
    };

    const response = await fetch("http://localhost:4000/api/workouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(workout),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("Workout toegevoegd:", data);
      setTitle("");
      setReps("");
      setLoad("");
    } else {
      console.error("Error:", data.error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="number"
        placeholder="Reps"
        value={reps}
        onChange={(e) => setReps(e.target.value)}
      />
      <input
        type="number"
        placeholder="Load (kg)"
        value={load}
        onChange={(e) => setLoad(e.target.value)}
      />
      <button type="submit">Toevoegen</button>
    </form>
  );
}

export default WorkoutForm;
