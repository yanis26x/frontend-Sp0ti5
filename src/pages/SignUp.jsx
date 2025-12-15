import { useState } from "react";
import axios from "axios";
import "../App.css";
import "./Home.css";
import Sidebar from "../components/Sidebar";

function SignUp({ onNavigate, onLoginSuccess, currentPage }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const HOST = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${HOST}auth/register`, {
        email,
        password,
        name,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user);
      }

      onNavigate("home");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la création du compte");
    }
  };

  return (
    <>
      <h1>Créer un compte</h1>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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

        <button type="submit">Créer mon compte</button>
      </form>

      <p
        style={{ marginTop: 20, cursor: "pointer", color: "rgb(6, 243, 255)" }}
        onClick={() => onNavigate("login")}
      >
        Déjà un compte ? Connecte-toi
      </p>
    </>
  );
}

export default SignUp;
