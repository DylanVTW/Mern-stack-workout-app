function DeleteWorkout({ workoutId, token, onDeleted }) {
  const handleDelete = async () => {
    if (!confirm("Weet je zeker dat je deze workout wilt verwijderen?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/api/workouts/${workoutId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Workout verwijderd:", data);
        if (onDeleted) {
          onDeleted(workoutId);
        }
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return <button onClick={handleDelete}>Verwijder workout</button>;
}

export default DeleteWorkout;
