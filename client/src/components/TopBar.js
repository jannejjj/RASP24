/*
File: Topbar.js
Author: Group 4
Course: CT10A7011 Running a Software Project - 8.1.2024-19.4.2024
Used: Every page
Props and Parameters: currentUser("memberSchema"), setCurrentUser
Description: The top bar allows the user to move between pages. The Toolbar is located at the top of every page.
GitHub: https://github.com/jannejjj/RASP24
*/

import React, { useState, useEffect } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
// Modals, components, and commons
import Swal from 'sweetalert2';
// MUI components
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Menu, MenuItem } from "@mui/material";
// Styles
import "../styles/TopBar.css";
// Icons
import MenuIcon from "@mui/icons-material/Menu";

export default function TopBar(props) {
  const [selectedPage, setSelectedPage] = useState("");
  const [anchorElNav, setAnchorElNav] = useState(null);
  let navigate = useNavigate();

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  // These 2 functions are just here to show that the buttons are clickable and do something

  //Removes Token from localStorage
  const logout = () => {
    if (props.currentUser.loggedIn) {
      // Empty the local/sessionStorage

      Swal.fire({
        title: 'Logout',
        text: 'Are you sure you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout!',
        cancelButtonText: 'Cancel',
        confirmButtonColor: "#2C041C",
        iconColor: "#85717C",
      }).then((result) => {
        if (result.isConfirmed) {
          // Empty the local/sessionStorage
          localStorage.removeItem('AssocEase_Token');
          sessionStorage.removeItem('AssocEase_MyProfileSelectedView');
          props.setCurrentUser(
            {
              admin: false,
              loggedIn: false,
              token: "",
              id: ""
            }
          );

          navigate('/Login');
        }
      });
    }
  };

  useEffect(() => {
    // Get the currently selected page when the website is reloaded
    const href = window.location.href;
    const data = href.split('/');
    const page = data[data.length - 1];

    if (page === "") {
      setSelectedPage("Home");
    }
    else {
      setSelectedPage(page);
    }
  }, [props]);

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleOpenNavMenu}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="appbar-menu"
            anchorEl={anchorElNav}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            keepMounted
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: "block", md: "none" },
            }}
          >
            <MenuItem component={RouterLink} to='/'>Home</MenuItem>
            <MenuItem component={RouterLink} to='/News'>News</MenuItem>
            <MenuItem component={RouterLink} to='/Members'>Members</MenuItem>
            {props.currentUser.loggedIn && <MenuItem component={RouterLink} to='/MyProfile'>My Profile</MenuItem>}
            {!props.currentUser.loggedIn && <MenuItem component={RouterLink} to='/Register'>Register</MenuItem>}
            {props.currentUser.loggedIn && <MenuItem onClick={logout} component={RouterLink}>Logout</MenuItem>}
            {!props.currentUser.loggedIn && <MenuItem onClick={logout} component={RouterLink} to='/Login'>Login</MenuItem>}
          </Menu>

          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to='/'
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 500,
              letterSpacing: ".2rem",
              color: "inherit",
              alignSelf: "center",
              textDecoration: "none",
            }}
            onClick={() => { setSelectedPage("Home") }}
          >
            AssocEase
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to='/'
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 500,
              letterSpacing: ".2rem",
              color: "inherit",
              textDecoration: "none",
            }}
            onClick={() => { setSelectedPage("Home") }}
          >
            AssocEase
          </Typography>
          <Button component={RouterLink} to='/'
            color="inherit"
            className="home-button"
            disabled={selectedPage === "Home"}
            disableRipple
            sx={{
              letterSpacing: ".2rem",
              paddingLeft: "24px",
              paddingRight: "12px",
            }}
            onClick={() => { setSelectedPage("Home") }}
          >
            Home
          </Button>
          <Button component={RouterLink} to='/News'
            color="inherit"
            className="members-button"
            disabled={selectedPage === "News"}
            disableRipple
            sx={{
              letterSpacing: ".1rem",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            onClick={() => { setSelectedPage("News") }}
          >
            News
          </Button>
          <Button component={RouterLink} to='/Members'
            color="inherit"
            className="members-button"
            disabled={selectedPage === "Members"}
            disableRipple
            sx={{
              letterSpacing: ".1rem",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            onClick={() => { setSelectedPage("Members") }}
          >
            Members
          </Button>
          <Button component={RouterLink} to='/Scheduler'
            color="inherit"
            disabled={selectedPage === "Scheduler"}
            className="scheduler-button"            
            disableRipple
            sx={{
              letterSpacing: ".1rem",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            onClick={() => { setSelectedPage("Scheduler") }}
          >
            Scheduler
          </Button>
          {props.currentUser.loggedIn && <Button component={RouterLink} to='/MyProfile'
            color="inherit"
            disabled={selectedPage === "MyProfile"}
            disableRipple
            sx={{
              letterSpacing: ".1rem",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            onClick={() => { setSelectedPage("MyProfile") }}
          >
            My profile
          </Button>}
          {!props.currentUser.loggedIn && <Button component={RouterLink} to='/Register'
            color="inherit"
            disabled={selectedPage === "Register"}
            disableRipple
            sx={{
              letterSpacing: ".1rem",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
            onClick={() => { setSelectedPage("Register") }}
          >
            Register
          </Button>}
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          {props.currentUser.loggedIn && <Button
            color="inherit"
            onClick={logout}
            sx={{ minWidth: "8vw" }}
            disableRipple
          >
            Logout
          </Button>}
          {!props.currentUser.loggedIn && <Button
            color="inherit"
            onClick={logout}
            component={RouterLink} to='/Login'
            sx={{ minWidth: "8vw" }}
            disableRipple
          >
            Login
          </Button>}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
