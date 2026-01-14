import "../components-css/LoginSignup.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import API_URL from "../api";

const LoginSignup = () => {
  const [action, setAction] = useState("Sign Up");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const email = document.querySelector('input[type="email"]')?.value;
    const username = document.querySelector('input[type="text"]')?.value;
    const password = document.querySelector('input[type="password"]')?.value;

    try {
      if (action === "Login") {
        // ✅ LOGIN
        const response = await fetch(`${API_URL}/api/user/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
          alert("Invalid username or password");
          return;
        }

        const user = await response.json();

        localStorage.setItem("UserID", user.UserID);
        localStorage.setItem("UserType", user.UserType);

        navigate(`/projects/${user.UserID}`);
      } else {
        // ✅ SIGN UP
        if (!email || !username || !password) {
          alert("All fields are required");
          return;
        }

        const roleInput = document.querySelector(
          'input[name="role"]:checked'
        );
        if (!roleInput) {
          alert("Select a role");
          return;
        }

        const response = await fetch(`${API_URL}/api/user/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Email: email,
            UserName: username,
            Password: password,
            UserType: roleInput.value,
          }),
        });

        if (!response.ok) {
          alert("User already exists or error creating user");
          return;
        }

        alert("Account created successfully. Please login.");
        setAction("Login");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
      </div>

      <div className="inputs">
        {action !== "Login" && (
          <div className="input">
            <FontAwesomeIcon icon={faEnvelope} className="icons" />
            <input type="email" placeholder="Email" />
          </div>
        )}

        <div className="input">
          <FontAwesomeIcon icon={faUser} className="icons" />
          <input type="text" placeholder="Username" />
        </div>

        <div className="input">
          <FontAwesomeIcon icon={faLock} className="icons" />
          <input type="password" placeholder="Password" />
        </div>

        {action !== "Login" && (
          <div className="input role-selection">
            <input type="radio" name="role" value="student" /> Student
            <input type="radio" name="role" value="professor" /> Professor
          </div>
        )}
      </div>

      <div className="submit-container">
        <div
          className={action === "Login" ? "submit gray" : "submit"}
          onClick={() => setAction("Login")}
        >
          Already have an account?
        </div>
        <div
          className={action === "Sign Up" ? "submit gray" : "submit"}
          onClick={() => setAction("Sign Up")}
        >
          Create Account
        </div>
      </div>

      <button className="submit" onClick={handleSubmit}>
        {action === "Login" ? "Login" : "Sign Up"}
      </button>
    </div>
  );
};

export default LoginSignup;
