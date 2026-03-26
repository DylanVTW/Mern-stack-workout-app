import { useNavigate } from "react-router-dom";

function ServicesPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="App">
      <h1>Beschikbare Diensten</h1>

      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleViewMyServices}>Mijn Afspraken</button>

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
