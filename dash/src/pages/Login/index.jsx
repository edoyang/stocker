import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess } from "../../redux/slices/authSlice";
import { useSelector } from "react-redux";
import "./style.css";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);

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

      dispatch(loginSuccess({ token, user }));

      alert("Login successful!");
      navigate("/");
    } catch (error) {
      console.error("There was an error logging in:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  return (
    <div className="login-page">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <label>Email or Username:</label>
        <input type="text" name="emailOrUsername" required />
        <label>Password:</label>
        <input type="password" name="password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
