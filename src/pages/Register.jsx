import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import "./Register.css"; // Import your CSS file

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    
    try {
      await api.post("/auth/register", { username, email, password });
      alert("Registered successfully. You can now login.");
      navigate("/login");
    } catch {
      alert("Registration failed");
    }
  };


  

  return (
    <div className="form-container">
      <h2>Register</h2>
      <form action={handleSubmit}>
        <div className="form-group">
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" required />
        </div>
        <div className="form-group">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div className="form-group">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        </div>
        <div className="form-group">
        <button type="submit">Register</button>
        </div>
        <div className="form-group">
        <p>Already have an account? <a href="/login">Login</a></p>

        </div>
      </form>
    </div>
  );
}

export default Register;
