import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/auth/register", {
      name,
      email,
      password,
    });
    alert("Registered Successfully");
    navigate("/");
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" onChange={(e) => setName(e.target.value)} /><br /><br />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} /><br /><br />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} /><br /><br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;