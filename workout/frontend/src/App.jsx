import { useEffect, useState } from "react";
import UpdateWorkout from "./components/UpdateWorkout";
import WorkoutForm from "./components/WorkoutForm";
import DeleteWorkout from "./components/DeleteWorkout";

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/workouts");
        const data = await response.json();
        setWorkouts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error", error);
      }
    };

    fetchWorkouts();
  }, []);

  const handleWorkoutUpdated = (updatedWorkout) => {
    setWorkouts((prev) =>
      prev.map((w) => (w._id === updatedWorkout._id ? updatedWorkout : w)),
    );
  };

  return (
    <div className="App">
      <h1>Workouts</h1>

      <button onClick={() => setShowForm(!showForm)}>
      Voeg workout toe
      </button>

      {showForm && <WorkoutForm />}
      {workouts.length === 0 ? (
        <p>Geen workouts gevonden</p>
      ) : (
        workouts.map((workout) => (
          <div key={workout._id}>
            <h3>{workout.title}</h3>
            <p>Reps: {workout.reps}</p>
            <p>Load: {workout.load} kg</p>

            <UpdateWorkout
              workoutId={workout._id}
              currentTitle={workout.title}
              currentReps={workout.reps}
              currentLoad={workout.load}
              onUpdated={handleWorkoutUpdated}
            />
            <DeleteWorkout workoutId={workout._id} />

          </div>
        ))
      )}
    </div>
  );
}

export default App;
