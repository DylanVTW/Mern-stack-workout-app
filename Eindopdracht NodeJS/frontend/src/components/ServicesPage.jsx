import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiCall } from "../utils/apiCall";

function ServicesPage() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [services, setServices] = useState([]); 


  const handleServiceCreated = () => {

  };

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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", padding: "10px 20px", borderBottom: "1px solid #ddd" }}>
        <h1>Beschikbare Diensten</h1>
        
        {/* Profile Circle */}
        <div
          onClick={() => navigate("/profile")}
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            backgroundColor: user?.profileImage ? "transparent" : "#007bff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid #007bff",
            overflow: "hidden",
          }}
        >
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
              {user?.username ? user.username[0].toUpperCase() : "U"}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: "0 20px" }}>
        <Link to="/profile">
          <button>Upload Profielfoto</button>
        </Link>

        <button onClick={handleLogout}>Logout</button>
        <button onClick={handleViewMyServices}>Mijn Afspraken</button>
      </div>

      {/* 🔹 LIST OF AVAILABLE SERVICES */}
      <div className="services-list">
        {availableServices.map((service) => (
          <div key={service.id} className="service-card">
            <h3>{service.name}</h3>
            <p><strong>Beschrijving:</strong> {service.description}</p>
            <p><strong>Prijs:</strong> €{service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );

  
}



export default ServicesPage;
