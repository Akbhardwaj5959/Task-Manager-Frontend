import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setToken } from "../redux/authSlice";
import api from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      dispatch(setToken(res.data.token));
      navigate("/");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
       </div>
       <div className="form-group">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        </div>
        <div className="form-group">
        <button type="submit">Login</button>
        </div>
       
      </form>
    </div>
  );
}

export default Login;

