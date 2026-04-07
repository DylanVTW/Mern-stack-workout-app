import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../utils/apiCall";

function ServiceForm({ onServiceCreated }) {
  // Form state for service type, date, and time
  const [Name, setName] = useState("knip");
  const [Date, setDate] = useState("");
  const [Time, setTime] = useState("");
  const [error, setError] = useState(null);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const { accessToken, refreshToken } = useAuth();

  useEffect(() => {
    if (!Date) {
      setAvailableTimeSlots([]);
      return;
    }

    const fetchAvailableTimeSlots = async () => {
      setLoading(true);
      try {
        const response = await apiCall(
          `http://localhost:5000/api/service/available-time-slots?date=${Date}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          { refreshToken }
        );
        if (!response.ok) {
          throw new Error("Fout bij ophalen beschikbare tijdslots");
        }

        const data = await response.json();
        setAvailableTimeSlots(data.availableTimeSlots);
        if (Time && !data.availableTimeSlots.includes(Time)) {
          setTime("");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableTimeSlots();
  }, [Date, accessToken, Time, refreshToken]);

  // Submit handler calls backend API and resets fields on success
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!Time) {
      setError("Selecteer een beschikbaar tijdslot");
    }

    const service = {
      Name: Name.trim().toLowerCase(),
      Date,
      Time,
    };

    try {
      const response = await apiCall("http://localhost:5000/api/service", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(service),
      },
      { refreshToken }
    );

      const data = await response.json();

      if (response.ok) {
        console.log("Afspraak toegevoegd:", data);

        // reset form
        setName("knip");
        setDate("");
        setTime("");
        setAvailableTimeSlots([]);

        if (onServiceCreated) {
          onServiceCreated(data);
        } else if (response.status === 409) {
          setError("Deze datum en tijd zijn al gereserveerd");

          const availableResponse = await apiCall(
            `http://localhost:5000/api/service/available-time-slots?date=${Date}`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            },
            { refreshToken }
          );
          if (availableResponse.ok) {
            const availableData = await availableResponse.json();
            setAvailableTimeSlots(availableData.availableTimeSlots);
          }
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

      {/* TIME SLOT SELECT */}
      {Date && (
        <div>
          <label htmlFor="time-select">Selecteer een tijdslot:</label>
          {loading ? (
            <p>Laden...</p>
          ) : availableTimeSlots.length > 0 ? (
            <select
              id="time-select"
              value={Time}
              onChange={(e) => setTime(e.target.value)}
            >
              <option value="">-- Kies een tijd --</option>
              {availableTimeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          ) : (
            <p style={{ color: "red" }}>Geen beschikbare tijdsloten voor deze dag</p>
          )}
        </div>
      )}
      

      {/* ERROR */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* BUTTON */}
      <button type="submit" disabled= {!Date || !Time || loading }>
        Maak afspraak
      </button>
    </form>
  );
}

export default ServiceForm;