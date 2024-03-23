import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Swal from 'sweetalert2';
import config from '../data/Config';

const Navbar = ({ logoutCallback }) => {
  const token = localStorage.getItem('token');
  console.log('token', token);
  const url = config.url + '/auth'; 
  const logout = () => {
    axios
      .post(
        `${url}/logout`,
        {}, // Empty request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      )
      .then((response) => {
        console.log('logout result', response);
        if (response.status === 201) {
          Swal.fire({
            title: 'Logged Out',
            text: 'You have been successfully logged out.',
            icon: 'success',
          });
          localStorage.clear();
          logoutCallback();
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Failed to logout. Please try again later.',
            icon: 'error',
          });
        }
      })
      .catch((error) => {
        console.error('logout error', error);
        Swal.fire({
          title: 'Error',
          text: 'Failed to logout. Please try again later.',
          icon: 'error',
        });
      });
  };
  

  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <Grid container spacing={2} justifyContent="space-between">
          <Grid item>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="h6"
                style={{ color: 'white', marginRight: '10px' }}
              >
                My App
              </Typography>
            </Link>
          </Grid>
          <Grid item>
            {token && (
              <Grid container justifyContent="space-around">
                <Grid item>
                  <NavLink to="/dashboard" color="inherit">
                    <Button style={{ color: 'white' }}>Dashboard</Button>
                  </NavLink>
                </Grid>
                <Grid item>
                  <NavLink to="/profile" color="inherit">
                    <Button style={{ color: 'white' }}>Profile</Button>
                  </NavLink>
                </Grid>
              </Grid>
            )}
          </Grid>

          <Grid item xs="auto">
            {token ? (
              <Button
                onClick={() => logout()}
                style={{ color: 'white', marginLeft: 'auto' }}
              >
                Logout
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
