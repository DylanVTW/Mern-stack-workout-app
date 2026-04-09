import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ServiceForm from "./ServiceForm";
import ProfileAvatar from "./ProfileAvatar";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../utils/apiCall";

function MyServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const { accessToken, refreshToken, logout } = useAuth();

  // 🔹 Fetch all services (ONLY YOURS)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await apiCall(
          "http://localhost:5000/api/service",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          { refreshToken },
        );

        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    if (accessToken) fetchServices();
  }, [accessToken, refreshToken]);

  // 🔹 Cancel service
  const handleCancel = async (id) => {
    try {
      const res = await apiCall(
        `http://localhost:5000/api/service/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ Status: "Geannuleerd" }),
        },
        { refreshToken },
      );

      const data = await res.json();

      if (res.ok) {
        setServices((prev) => prev.map((s) => (s._id === id ? data : s)));
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Delete Service (optional)
  const handleDelete = async (id) => {
    try {
      await apiCall(
        `http://localhost:5000/api/service/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
        { refreshToken },
      );

      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Go back to the available services page
  const handleBackToServices = () => {
    navigate("/services");
  };

  // Format ISO date string into a human-readable date
  const formatDate = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("nl-NL");
  };

  // Logout and clear token
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          padding: "10px 20px",
          borderBottom: "1px solid #ddd",
        }}
      >
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
        <h1>Mijn Afspraken</h1>
        </div>
        <ProfileAvatar />
        <Link to="/profile">
          <button
            style={{
              padding: "8px 12px",
              backgroundColor: "#008080",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            >Upload Profielfoto
            </button>
        </Link>
      
        <button onClick={handleBackToServices}
        style={{
            padding: "8px 12px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>Terug naar Diensten</button>
        
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 12px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
    
        <button onClick={() => setShowForm(!showForm)}
          style={{padding: "8px 12px",
            backgroundColor: "#228B22",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}>Maak afspraak</button>
        

      </div>

      {showForm && (
        <ServiceForm
          onServiceCreated={(newService) => {
            setServices((prev) => [...prev, newService]);
            setShowForm(false); // closes form after submit
          }}
        />
      )}

      {/* 🔹 LIST */}
      {services.length === 0 ? (
        <p style={{ padding: "20px", textAlign: "center" }}>Geen afspraken gevonden</p>
      ) : (
        <div style={{ padding: "0 20px" }}>
          {services.map((service) => (
            <div
              key={service._id}
              style={{
                padding: "15px",
              }}
            >
              <h3 style={{ margin: "0 0 10px 0", color: "#333" }}>{service.Name}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "15px" }}>
                <p style={{ margin: "0" }}><strong>Datum:</strong> {formatDate(service.Date)}</p>
                <p style={{ margin: "0" }}><strong>Tijd:</strong> {service.Time}</p>
                <p style={{ margin: "0" }}><strong>Status:</strong> {service.Status}</p>
                <p style={{ margin: "0" }}><strong>Prijs:</strong> €{service.Price}</p>
              </div>
              <p style={{ margin: "0 0 15px 0" }}><strong>Descriptie:</strong> {service.Description}</p>

              {/* 🔹 CANCEL BUTTON */}
              {service.Status !== "Geannuleerd" && (
                <button
                  onClick={() => handleCancel(service._id)}
                  style={{
                    padding: "8px 12px",
                    backgroundColor: "#ffc107",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Annuleer
                </button>
              )}

              {/* 🔹 DELETE (optional) */}
              <button
                onClick={() => handleDelete(service._id)}
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Verwijder
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyServices;
