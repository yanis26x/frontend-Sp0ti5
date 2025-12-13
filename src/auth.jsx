import { useState } from "react";
import axios from "axios";

export default function Auth({ goHome }) {
  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // ============================
  //   COMME ICI STRUCTURE
  // ============================
  const HOST = import.meta.env.VITE_API_URL;
  // ============================

  const handleSubmit = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(`${HOST}auth/login`, {
          email,
          password,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Connexion réussie !");
        goHome();

      } else {
        const res = await axios.post(`${HOST}auth/register`, {
          email,
          password,
          name,
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Compte créé !");
        goHome();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Erreur");
    }
  };

  return (
    <div className="page">
      <button onClick={goHome} style={{ marginBottom: 20 }}>
        ← Retour
      </button>

      <h1>{isLogin ? "Connexion" : "Créer un compte"}</h1>

      {!isLogin && (
        <input
          placeholder="Nom"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        placeholder="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {isLogin ? "Se connecter" : "Créer mon compte"}
      </button>

      <p
        style={{ marginTop: 20, cursor: "pointer", color: "red" }}
        onClick={() => setIsLogin(!isLogin)}
      >
        {isLogin ? "Pas de compte ? Inscris-toi" : "Déjà un compte ? Connecte-toi"}
      </p>


      <div className="prFaireVite">
        <button
          onClick={() => {
            setEmail("alic2e@example.com");
            setPassword("password123");
            setName("alice");
          }}
        >
          Auto remplir : alice2e@example.com / password123
        </button>
      </div>
    </div>
  );
}
