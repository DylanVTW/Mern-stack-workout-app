import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import WorkoutsPage from "./components/WorkoutsPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/workouts"
          element={
            <PrivateRoute>
              <WorkoutsPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/workouts" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
