import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ProfileAvatar from "./ProfileAvatar";

function ServicesPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  // 🔹 Available services
  const availableServices = [
    {
      id: "knip",
      name: "Knip",
      price: 25,
      description: "Standaard haarknip",
    },
    {
      id: "fade",
      name: "Fade",
      price: 30,
      description: "Fade haircut",
    },
    {
      id: "baard",
      name: "Baard",
      price: 15,
      description: "Baard Trimmen",
    },
  ];

  // Navigate to page showing this user’s appointments
  const handleViewMyServices = () => {
    navigate("/my-services");
  };

  // Logout and redirect to login
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <h1>Beschikbare Diensten</h1>
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              style={{
                padding: "8px 12px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Admin Pagina
            </button>
          )}
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
          >
            Upload Profielfoto
          </button>
        </Link>

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
        <button
          onClick={handleViewMyServices}
          style={{
            padding: "8px 12px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Mijn Afspraken
        </button>
      </div>

      {/* 🔹 LIST OF AVAILABLE SERVICES */}
      <div className="services-list">
        {availableServices.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p>
              <strong>Beschrijving:</strong> {service.description}
            </p>
            <p>
              <strong>Prijs:</strong> €{service.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesPage;
