import { useState } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function Login({ onNavigate, onLoginSuccess, currentPage }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const HOST = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${HOST}auth/login`, {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user);
      }

      onNavigate("home");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur de connexion");
    }
  };

  return (
    <>
      <h1>Connexion</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: "#ff5050", marginBottom: 15 }}>{error}</p>
        )}

        <button type="submit">Se connecter</button>
      </form>

      <p
        style={{ marginTop: 20, cursor: "pointer", color: "rgb(6, 243, 255)" }}
        onClick={() => onNavigate("signup")}
      >
        Pas de compte ? Inscris-toi
      </p>

      <div className="prFaireVite">
        <button
          onClick={() => {
            setEmail("alic2e@example.com");
            setPassword("password123");
          }}
        >
          Auto remplir : alice2e@example.com / password123
        </button>
      </div>
    </>
  );
}

export default Login;
