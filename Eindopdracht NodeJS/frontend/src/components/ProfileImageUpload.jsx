import { useState } from "react";
import { useAuth } from "../context/AuthContext";


function ProfileImageUpload() {
    const [selectedFile, setSelectedFile]  = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const { accessToken } = useAuth();

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = ["image.jpg", "image/jpeg", "image/png", "image/webp", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setError("Ongeldig bestandstype. Alleen JPG, JPEG, PNG, WEBP en GIF zijn toegestaan.");
            return;
        }


        if (file.size > 2 * 1024 * 1024) {
            setError("Bestand is te groot. Maximaal 2MB.");
            return;
        }
        setSelectedFile(file);
        setError(null);


        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readerAsDataUrl(file);
};

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError("Selecteer een afbeelding om te uploaden.");
            return;
        }
        setUploading(true);
        setError(null);
        setSuccess(false);

        try {
            const formData = new formData();
            formData.append("profileImage", selectedFile);

            const response = await fetch("http://localhost:5000/api/auth/profile/image", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                }, 
                credentials: "include",
                body: formData,
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Fout bij uploaden afbeelding.");
                setUploading(false);
                return;
            }

            setSuccess(true);
            setSelectedFile(null);
            setPreview(null);

            const user = JSON.parse(sessionStorage.getItem("user") || "{}");
            user.profileImage = data.profileImage;
            sessionStorage.setItem("user", JSON.stringify(user));

            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (error) {
            setError("Server error: " + error.message);
            setUploading(false);
        }
    };

    return (
        <div style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
      <h3>Profielfoto uploaden</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="file"
            accept="image/jpg,image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            style={{ display: "block", marginBottom: "10px" }}
          />
          {preview && (
            <div style={{ marginTop: "10px" }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ maxWidth: "150px", maxHeight: "150px", borderRadius: "8px" }}
              />
            </div>
          )}
        </div>

        {error && <p style={{ color: "red", marginBottom: "15px" }}>{error}</p>}
        {success && <p style={{ color: "green", marginBottom: "15px" }}>Profielfoto succesvol geupload!</p>}

        <button
          type="submit"
          disabled={!selectedFile || uploading}
          style={{
            padding: "10px 20px",
            backgroundColor: !selectedFile || uploading ? "#ccc" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: !selectedFile || uploading ? "not-allowed" : "pointer",
          }}
        >
          {uploading ? "Bezig met uploaden..." : "Uploaden"}
        </button>
      </form>
    </div>
    );
}

export default ProfileImageUpload;