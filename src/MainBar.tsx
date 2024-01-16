import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import GitHubIcon from '@mui/icons-material/GitHub';

export default function MenuAppBar()
{
  const isSmallScreen = window.innerWidth < 600;

  return (
    <Box sx={{ flexGrow: 1, marginBottom: "10px" }}>
      <AppBar position="static">
        <Toolbar>
          {isSmallScreen ? (<Typography
            align='center'
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Siralim Ultimate Saver
          </Typography>) : (<Typography
            align='center'
            variant="h5"
            component="div"
            sx={{ flexGrow: 1 }}
          >
            Siralim Ultimate Saver
          </Typography>)}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="github"
            component="a"
            href="https://github.com/lumpsoid/SiralimUltimateSaver"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ mr: 2 }}
          >
            <GitHubIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}