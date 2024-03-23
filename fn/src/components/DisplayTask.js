import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Icon from "@material-ui/core/Icon";
import { Grid } from "@material-ui/core";
import config from "../data/Config";
import Task from "./Task";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Swal from "sweetalert2";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button,
} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import axios from "axios";

const DisplayTask = () => {
  const [data, setData] = useState([]);
  const [task, setTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const url = config.url + "/tasks";
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  let uid = localStorage.getItem("uid");

  //Token handle
  const token1 = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  };

  // modal show
  const handleShow = (id) => {
    const selectTask = data.filter((item) => item.id === id)[0];
    if (selectTask) {
      setTask(selectTask);
      setShow(true);
    }
  };

  useEffect(() => {
    console.log("before");
    getData();
    console.log("after");
  }, []);

  //Display all Data
  const getData = () => {
    console.log("get data calling");
    axios
      .get(`${url}/findByUser/${uid}`, token1)
      .then((response) => {
        console.log("response-task",response);
        setData(response.data);
        
      })
      .catch((error) => {
        console.log(error);
        // Handle the error
      });

  };
console.log("data",data);

  //Delete Task
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure ?",
      text: "You want to delete this task",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`${url}/${id}`, token1)
          .then((response) => {
            console.log("response", response);
            getData();
            Swal.fire({
              title: "Deleted!",
              text: "Task has been deleted.",
              icon: "success",
            });
          })
          .catch((error) => {
            console.log("error", error);
            Swal.fire({
              title: "Oops...",
              text: "Something went wrong!",
              icon: "error",
            });
          });
      }
    });
  };

  //Update Task
  const handleUpdate = (id) => {
    setEditTask(id);
    console.log("editTask", editTask);
  };

  const tasktable =()=>{
    console.log("Calling...");
    return(
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Hours</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ?(
            data.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.hours}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleShow(item.id)}
                    style={{ lineHeight: 0 }}
                  >
                    <Icon>
                      <VisibilityIcon />
                    </Icon>
                  </Button>
                  <Button
                    variant="contained"
                    color="white"
                    component={Link}
                    style={{
                      textDecoration: "none",
                      marginLeft: "6px",
                      marginBottom: "1px",
                      backgroundColor: "gray",
                      color: "white",
                    }}
                    onClick={() => handleUpdate(item._id)}
                  >
                    <EditIcon />
                  </Button>
                  &nbsp;
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleDelete(item._id)}
                  >
                    <DeleteIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} align="center">
                No Task Available
              </TableCell>
            </TableRow>
          )
          }
        </TableBody>
      </Table>
      
    )
  }

  return (
    <div>
      {/* Props Wise pass Id */}
      {editTask && <Task id={editTask} />}
      {!editTask && (
        <Grid container style={{ marginTop: "50px" }}>
          <Grid item xs={12}>
            <Grid container justifyContent="flex-end">
              <Grid item lg={7}>
                <Button
                  variant="contained"
                  color="success"
                  component={Link}
                  style={{
                    textDecoration: "none",
                    backgroundColor: "darkblue",
                    color: "white",
                    marginBottom: "28px",
                    marginRight:"140px"
                  }}
                  onClick={() => handleUpdate("0")}
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
            <Paper
              elevation={20}
              style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}
            >
             <h3>Display Task</h3>
             {tasktable()}
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* view modal */}

      <Modal show={show} onHide={handleClose} style={{ marginTop: "40px" }}>
        <Modal.Header closeButton>
          <Modal.Title>View Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {task && (
            <Grid container spacing={2}>
              <React.Fragment key={task.id}>
                <Grid item xs={12}>
                  <b>Name: </b> {task.name}
                </Grid>
                <Grid item xs={12}>
                  <b>Description:</b> {task.description}
                </Grid>
                <Grid item xs={12}>
                  <b>Hours:</b> {task.hours}
                </Grid>
              </React.Fragment>
            </Grid>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button
            onClick={handleClose}
            style={{ backgroundColor: "#999999", color: "white" }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
export default DisplayTask;
