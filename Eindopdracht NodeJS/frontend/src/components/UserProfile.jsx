import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProfileImageUpload from "./ProfileImageUpload";

function UserProfile() {
    const { user, accessToken } = useAuth();
    const [profileUser, setProfileUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            if(!accessToken) {
                setError("je moet ingelogd zijn");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/auth/profile", {
                    methid: "GET",
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                    credentials: "include",
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message ||  "Kan profiel niet laden");
                    setLoading(false);
                    return;
                }

                setProfileUser(data);
                setLoading(false);
            } catch (error) {
                setError("Server error: " + error.message);
                setLoading(false);
            }
        };
        fetchProfile();
    }, [accessToken]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div style={{color: "red"}}>Fout: {error}</div>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px" }}>
      <h1>Mijn Profiel</h1>

      {profileUser && (
        <div style={{ marginBottom: "30px", padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
          <h2>Profielfoto</h2>
          {profileUser.profileImage ? (
            <img
              src={profileUser.profileImage}
              alt="Profielfoto"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            />
          ) : (
            <div style={{
              width: "200px",
              height: "200px",
              backgroundColor: "#f0f0f0",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "20px",
            }}>
              Geen profielfoto
            </div>
          )}

          <h2>Persoonlijke Informatie</h2>
          <p><strong>Gebruikersnaam:</strong> {profileUser.username}</p>
          <p><strong>Email:</strong> {profileUser.email}</p>
          <p><strong>Rol:</strong> {profileUser.role === 'admin' ? 'Beheerder' : 'Gebruiker'}</p>

          <hr style={{ margin: "30px 0" }} />

          <ProfileImageUpload />
        </div>
      )}
    </div>
    );
}

export default UserProfile;