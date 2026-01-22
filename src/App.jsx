import { Routes, Route } from "react-router-dom";
import Login from "./Authentication/Login";
import Signup from "./Authentication/SignUp";
import Admin from "./Components/Admin/Admin";
import ProtectedRoute from "./Routes/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
