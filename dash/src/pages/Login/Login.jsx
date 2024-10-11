import axios from "axios";
import React from "react";
import { useDispatch } from "react-redux"; // Import Redux dispatch
import { useNavigate } from "react-router-dom"; // Import navigation
import { loginSuccess } from "../../redux/slices/authSlice"; // Import your login action

const Login = () => {
  const dispatch = useDispatch(); // Redux dispatch function
  const navigate = useNavigate(); // For navigation

  // Use async/await for better error handling and clarity
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        {
          emailOrUsername: e.target.emailOrUsername.value, // Grabbing email input value
          password: e.target.password.value, // Grabbing password input value
        }
      );

      // Extract token and user data from the response
      const { token, user } = response.data;

      // Store the token and user in Redux
      dispatch(loginSuccess({ token, user }));

      // Optionally store the token in localStorage
      localStorage.setItem("jwtToken", token);

      console.log("Login successful:", response.data);
      alert("Login successful!");

      // Redirect to the home page
      navigate("/");
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
