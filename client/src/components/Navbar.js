import React from "react";
import { Box, Link, Typography, useTheme } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
const Navbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const loggedIn = JSON.parse(localStorage.getItem("authToken"));
  const handleLogout = async () => {
    try {
      await axios.post("/api/v1/auth/logout");
      localStorage.removeItem("authToken");
      toast.success("logout successfully ");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Box
        width={"100%"}
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textAlign={"center"}
        sx={{ boxShadow: 3, mb: 2 }}
      >
        <Typography variant="h1" color="primary" fontWeight="bold">
          AI GPT3 Clone
        </Typography>
        {loggedIn ? (
          <>
            <NavLink to="/" p={1}>
              Home
            </NavLink>
            <NavLink to="/login" onClick={handleLogout} p={1}>
              Logout
            </NavLink>
          </>
        ) : (
          <>
            <NavLink to="/register" p={1}>
              Sign Up
            </NavLink>
            <NavLink to="/login" p={1}>
              Sign In
            </NavLink>
          </>
        )}
      </Box>
    </>
  );
};

export default Navbar;
