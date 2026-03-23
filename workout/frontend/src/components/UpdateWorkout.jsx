import { useState } from "react";

function UpdateWorkout({ workoutId, currentTitle, currentReps, currentLoad, token, onUpdated }) {
  const [title, setTitle] = useState(currentTitle);
  const [reps, setReps] = useState(currentReps);
  const [load, setLoad] = useState(currentLoad);
  const [error, setError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    const updatedWorkout = {
      title,
      reps: Number(reps),
      load: Number(load),
    };

    try {
      const response = await fetch(
        `http://localhost:4000/api/workouts/${workoutId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(updatedWorkout),
        },
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Workout bijgewerkt:", data);
        onUpdated?.(data);
      } else {
        setError(data.error || "Error bij het bijwerken");
      }
    } catch (error) {
      setError("Server error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleUpdate}>
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
      <button type="submit">Update Workout</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}


export default UpdateWorkout;