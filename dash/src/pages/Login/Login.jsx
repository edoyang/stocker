import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/slices/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          emailOrUsername: e.target.emailOrUsername.value,
          password: e.target.password.value,
        }
      );

      const { token, user } = response.data;

      // Store the token and user in Redux and localStorage
      dispatch(loginSuccess({ token, user }));
      localStorage.setItem("jwtToken", token);

      alert("Login successful!");

      // Redirect to the home page
      navigate("/"); // Redirect to Home after login
    } catch (error) {
      console.error("There was an error logging in:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Email or Username:
          <input type="text" name="emailOrUsername" required />
        </label>
        <label>
          Password:
          <input type="password" name="password" required />
        </label>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
