import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ServiceForm from "./ServiceForm";

function ServicesPage() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔹 Fetch all appointments (ONLY YOURS)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/service", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setServices(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
      }
    };

    if (token) fetchServices();
  }, [token]);


  // 🔹 Cancel appointment
  const handleCancel = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/service/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ Status: "Geannuleerd" }),
      });

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

  // 🔹 Delete appointment (optional)
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/service/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="App">
      <h1>Afspraken</h1>

      <button onClick={handleLogout}>Logout</button>

      <button onClick={() => setShowForm(!showForm)}>Maak afspraak</button>

      {showForm && (
        <ServiceForm
          token={token}
          onServiceCreated={(newService) => {
            setServices((prev) => [...prev, newService]);
            setShowForm(false); // closes form after submit
          }}
        />
      )}

      {/* 🔹 LIST */}
      {services.length === 0 ? (
        <p>Geen afspraken gevonden</p>
      ) : (
        services.map((service) => (
          <div key={service._id}>
            <h3>{service.Name}</h3>
            <p>Datum: {service.Date}</p>
            <p>Tijd: {service.Time}</p>
            <p>Status: {service.Status}</p>
            <p>Prijs: €{service.Price}</p>
            <p>Descriptie: {service.Description}</p>

            {/* 🔹 CANCEL BUTTON */}
            {service.Status !== "Geannuleerd" && (
              <button onClick={() => handleCancel(service._id)}>
                Annuleer
              </button>
            )}

            {/* 🔹 DELETE (optional) */}
            <button onClick={() => handleDelete(service._id)}>Verwijder</button>
          </div>
        ))
      )}
    </div>
  );
}

export default ServicesPage;
