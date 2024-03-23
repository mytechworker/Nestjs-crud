import axios from 'axios';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Paper, Grid } from '@material-ui/core';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import config from '../data/Config';
import Swal from 'sweetalert2';

const TaskSchema = Yup.object().shape({
  name: Yup.string()
    .required('Please enter a name')
    .min(2, 'Name must contain 2 characters long'),
  description: Yup.string()
    .required('Please enter a description')
    .min(2, 'Description must contain 2 characters long'),
  hours: Yup.number()
    .required('Please enter hours')
    .min(0, 'hours must be greater than or equal to 0'),
});

const Task = (props) => {
  console.log('props', props);
  const navigation = useNavigate();
  const { id } = props;
  const url = config.url;
  const uid = localStorage.getItem('uid');

  const handleResponse = (message, navigation) => {
    console.log(message);
    Swal.fire({
      icon: 'success',
      text: message,
    }).then((res) => {
      console.log('sssssaa', res);
      navigation('/dashbord');
    });
  };

  const token = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  };

  //Handle Data
  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      hours: '',
    },
    validationSchema: TaskSchema,
    onSubmit: (values) => {
      const data = {
        name: values.name,
        description: values.description,
        hours: values.hours,
        uid,
        id,
      };
      const message =
        id && id !== '0'
          ? 'Task Updated successfully!'
          : 'Task added successfully!';
      const axiosCall = id && id !== '0' ? axios.put : axios.post;
      const urlEnd = id && id !== '0' ? `${url}/tasks/${id}` : `${url}/tasks`;
      axiosCall(urlEnd, data, token)
        .then(() => {
          handleResponse(message, navigation('/'));
        })
        .catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: `Failed to ${
              id && id !== '0' ? 'Update' : 'add'
            } task. Please try again later.`,
          });
          console.log(err);
        });
    },
  });

  useEffect(() => {
    const findData = () => {
      const token = localStorage.getItem('token');
      axios
        .get(`${url}/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((rlt) => {
          formik.setValues({
            name: rlt.data.name,
            description: rlt.data.description,
            hours: rlt.data.hours,
          });
        });
    };
    if (id && id !== '0') findData();
  }, [id]);

  //cancel
  const handleCancel = () => {
    navigation('/');
  };

  const renderTextField = (name, label, type = 'text') => (
    <Grid item>
      <TextField
        label={label}
        name={name}
        type={type}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && formik.errors[name]}
        helperText={formik.touched[name] && formik.errors[name]}
        style={{ marginLeft: '10px', width: '325px' }}
      />
    </Grid>
  );

  return (
    <div style={{ marginTop: '100px' }}>
      <Paper
        elevation={20}
        style={{
          padding: '20px',
          maxWidth: '400px',
          margin: '0 auto',
        }}
      >
        <h3>Task</h3>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            {renderTextField('name', 'Enter Title')}
            {renderTextField('description', 'Enter Description')}
            {renderTextField('hours', 'Enter Hours')}

            <Grid item container spacing={2} xs={12}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  {id && id !== '0' ? 'Update' : 'Submit'}
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </div>
  );
};

export default Task;
