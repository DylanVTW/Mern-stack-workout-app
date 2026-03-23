import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UpdateWorkout from "./UpdateWorkout";
import WorkoutForm from "./WorkoutForm";
import DeleteWorkout from "./DeleteWorkout";

function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  // Get token from localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/workouts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setWorkouts(Array.isArray(data) ? data : data.data || []);
      } catch (error) {
        console.error("Error", error);
      }
    };

    if (token) {
      fetchWorkouts();
    }
  }, [token]);

  const handleWorkoutUpdated = (updatedWorkout) => {
    setWorkouts((prev) =>
      prev.map((w) => (w._id === updatedWorkout._id ? updatedWorkout : w))
    );
  };

  const handleWorkoutCreated = (newWorkout) => {
    setWorkouts((prev) => [...prev, newWorkout]);
    setShowForm(false);
  };

  const handleWorkoutDeleted = (workoutId) => {
    setWorkouts((prev) => prev.filter((w) => w._id !== workoutId));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="App">
      <h1>Workouts</h1>

      <button onClick={handleLogout}>Logout</button>

      <button onClick={() => setShowForm(!showForm)}>
        Voeg workout toe
      </button>

      {showForm && (
        <WorkoutForm
          token={token}
          onWorkoutCreated={handleWorkoutCreated}
        />
      )}
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
              token={token}
              onUpdated={handleWorkoutUpdated}
            />
            <DeleteWorkout
              workoutId={workout._id}
              token={token}
              onDeleted={handleWorkoutDeleted}
            />
          </div>
        ))
      )}
    </div>
  );
}

export default WorkoutsPage;
