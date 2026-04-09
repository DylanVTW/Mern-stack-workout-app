import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../utils/apiCall";
import ProfileAvatar from "./ProfileAvatar";

function AdminDashboard() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { accessToken, refreshToken, logout, user } = useAuth();

  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/services");
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await apiCall(
          "http://localhost:5000/api/admin/services",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          },
          { refreshToken },
        );

        if (response.status === 401) {
          setError("Je hebt geen adminrechten om deze pagina te bekijken.");
          navigate("/services");
          return;
        }

        if (!response.ok) {
          throw new Error("Er is een fout opgetreden");
        }

        const data = await response.json();
        setServices(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    if (accessToken && user?.role === "admin") {
      fetchServices();
    }
  }, [accessToken, user, navigate, refreshToken]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error:{error}</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Admin Dashboard</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ProfileAvatar />
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
          <button
            onClick={() => navigate("/services")}
            style={{
              padding: "10px 20px",
              backgroundColor: "#6c757d",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Terug naar Home
          </button>
        </div>
      </div>

      {services.length === 0 ? (
        <p>Geen services gevonden</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #ddd",
            }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "#f8f9fa",
                  borderBottom: "2px solid #ddd",
                }}
              >
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  Service
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  Beschrijving
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  Prijs
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  Datum
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  Tijd
                </th>
                <th
                  style={{
                    padding: "12px",
                    textAlign: "left",
                    borderRight: "1px solid #ddd",
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr
                  key={service._id}
                  style={{ borderBottom: "1px solid #ddd" }}
                >
                  <td
                    style={{ padding: "12px", borderRight: "1px solid #ddd" }}
                  >
                    {service.Name}
                  </td>
                  <td
                    style={{ padding: "12px", borderRight: "1px solid #ddd" }}
                  >
                    {service.Description}
                  </td>
                  <td
                    style={{ padding: "12px", borderRight: "1px solid #ddd" }}
                  >
                    €{service.Price}
                  </td>
                  <td
                    style={{ padding: "12px", borderRight: "1px solid #ddd" }}
                  >
                    {new Date(service.Date).toLocaleDateString("nl-NL")}
                  </td>
                  <td
                    style={{ padding: "12px", borderRight: "1px solid #ddd" }}
                  >
                    {service.Time}
                  </td>
                  <td
                    style={{
                      padding: "12px",
                      color:
                        service.Status === "Gepland" ? "#28a745" : "#dc3545",
                      fontWeight: "bold",
                    }}
                  >
                    {service.Status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
