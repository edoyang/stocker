import { useEffect, useState } from "react";

const Theme = () => {
  // State to track the current theme
  const [theme, setTheme] = useState("light");

  // Set the theme on initial load based on localStorage or default to 'light'
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.body.classList.add(savedTheme);
  }, []);

  // Function to toggle the theme
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    // Remove the previous theme and add the new one
    document.body.classList.remove(theme);
    document.body.classList.add(newTheme);

    // Save the new theme to localStorage
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    </button>
  );
};

export default Theme;
