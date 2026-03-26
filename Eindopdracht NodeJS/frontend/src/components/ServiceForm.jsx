import { useState } from "react";

function ServiceForm({ token, onServiceCreated }) {
  // Form state for service type, date, and time
  const [Name, setName] = useState("knip");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [error, setError] = useState(null);

  // Submit handler calls backend API and resets fields on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const service = {
      Name: Name.trim().toLowerCase(),
      Date,
      Time,
    };

    try {
      const response = await fetch("http://localhost:5000/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(service),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Afspraak toegevoegd:", data);

        // reset form
        setName("knip");
        setDate("");
        setTime("");

        if (onServiceCreated) {
          onServiceCreated(data);
        }
      } else {
        setError(data.error || "Fout bij aanmaken afspraak");
      }
    } catch (error) {
      setError("Server error: " + error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Nieuwe afspraak</h3>

      {/* SERVICE SELECT */}
      <select value={Name} onChange={(e) => setName(e.target.value)}>
        <option value="knip">Knip (€25)</option>
        <option value="fade">Fade (€30)</option>
        <option value="baard">Baard (€15)</option>
      </select>

      {/* DATE */}
      <input
        type="date"
        value={Date}
        onChange={(e) => setDate(e.target.value)}
      />

      {/* TIME */}
      <input
        type="time"
        value={Time}
        onChange={(e) => setTime(e.target.value)}
      />

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* BUTTON */}
      <button type="submit">Maak afspraak</button>
    </form>
  );
}

export default ServiceForm;