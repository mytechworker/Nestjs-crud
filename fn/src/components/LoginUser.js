import React from 'react';
import { Link } from 'react-router-dom';
import { Button, TextField, Paper, Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import config from '../data/Config';
import Swal from 'sweetalert2';

export const LoginUser = ({ onLogin }) => {
  const url = config.url + '/auth';

  //handle Data
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },

    //validation
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(6, 'Password should be at least 6 characters'),
    }),

    onSubmit: (values) => {
      const data = {
        email: values.email,
        password: values.password,
      };
      axios
        .post(`${url}/login`, data)
        .then((result) => {
          localStorage.setItem('name', result.data.name);
          localStorage.setItem('uid', result.data.uid);
          localStorage.setItem('token', result.data.token);
          onLogin(result.data.token);

          //use Sweet alert
          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Your account Successfully Created!',
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password!',
          });
          console.log(error);
        });
    },
  });

  return (
    <div
      style={{
        marginTop: '150px',
      }}
    >
      <Paper
        elevation={20}
        style={{
          padding: '20px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <h3> Login </h3>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="email"
                name="email"
                value={formik.values.email}
                label="Enter Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                style={{ width: '325px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                name="password"
                value={formik.values.password}
                label="Enter Password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                style={{ width: '325px' }}
              />
            </Grid>

            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="primary">
                Login
              </Button>
            </Grid>
            <Grid item xs={12}>
              Don't have an account?
              <Link to="/registration"> Registration </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};
