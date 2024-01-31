import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "../styles/TopBar.css";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
// import IconButton from "@mui/material/IconButton";
// import MenuIcon from "@mui/icons-material/Menu";
import { Link as RouterLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export default function TopBar() {
  const [language, setLanguage] = useState("EN");
  const [anchorElNav, setAnchorElNav] = useState(null);
  let navigate = useNavigate();

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  // These 2 functions are just here to show that the buttons are clickable and do something

  const toggleLanguage = (lan) => {
    setLanguage(lan);
  };

  //logged in status
  let loggedIn = false;
  if(sessionStorage.getItem('token')) {
      loggedIn = true;
  }

  const logout = () => {
    if(loggedIn) {
      sessionStorage.removeItem('token');
      loggedIn = false;
      navigate('/Home')
    }
  };

  return (
    <AppBar position="static">
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
            <MenuItem component={RouterLink} to='/home'>Home</MenuItem>
            <MenuItem component={RouterLink} to='/members'>Members</MenuItem>
            <MenuItem component={RouterLink} to='/myprofile'>My Profile</MenuItem>
            {loggedIn && <MenuItem onClick={logout} component={RouterLink}>Logout</MenuItem>}
            {!loggedIn && <MenuItem onClick={logout} component={RouterLink} to='/login'>Login</MenuItem>}
          </Menu>

          <Typography
            variant="h5"
            noWrap
            component="span"
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 500,
              letterSpacing: ".2rem",
              color: "inherit",
              alignSelf: "center",
            }}
          >
            AssocEase
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
          <Typography
            variant="h5"
            noWrap
            component="span"
            sx={{
              mr: 2,
              display: "flex",
              fontWeight: 500,
              letterSpacing: ".2rem",
              color: "inherit",
            }}
          >
            AssocEase
          </Typography>
          <Button component={RouterLink} to='/home'
            color="inherit"
            className="home-button"
            disableRipple
            sx={{
              letterSpacing: ".2rem",
              paddingLeft: "24px",
              paddingRight: "12px",
            }}
          >
            Home
          </Button>
          <Button component={RouterLink} to='/members'
            color="inherit"
            className="members-button"
            disableRipple
            sx={{
              letterSpacing: ".1rem",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            Members
          </Button>
          <Button component={RouterLink} to='/myprofile'
            color="inherit"
            disableRipple
            sx={{
              letterSpacing: ".1rem",
              paddingLeft: "12px",
              paddingRight: "12px",
            }}
          >
            My profile
          </Button>
        </Box>

        <Box sx={{ display: { xs: "none", md: "flex" } }}>
          <Button
            color="inherit"
            className="fi-button"
            disabled={language === "FI"}
            sx={{ letterSpacing: ".1rem" }}
            onClick={() => {
              toggleLanguage("FI");
            }}
          >
            FI
          </Button>
          <Button
            color="inherit"
            disabled={language === "EN"}
            sx={{ letterSpacing: ".1rem" }}
            onClick={() => {
              toggleLanguage("EN");
            }}
          >
            EN
          </Button>
          {loggedIn && <Button
            color="inherit"
            onClick={logout}
            sx={{ minWidth: "8vw" }}
            disableRipple
          >
            Logout
          </Button>}
          {!loggedIn && <Button
            color="inherit"
            onClick={logout} 
            component={RouterLink} to='/login'
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
