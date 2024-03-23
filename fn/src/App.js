import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Task from './components/Task';
import DisplayTask from './components/DisplayTask';
import { LoginUser } from './components/LoginUser';
import RegistrationUser from './components/RegistrationUser';
const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    const token1 = localStorage.getItem('token');
    setToken(token1);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar logoutCallback={handleLogout} />
        <Routes>
          <Route
            path="/registration"
            element={
              token ? <Navigate to="/dashboard" /> : <RegistrationUser />
            }
          />
          <Route
            path="/dashboard"
            element={token ? <DisplayTask /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={token ? <Profile /> : <Navigate to="/" />}
          />
          <Route
            path="/addtask"
            element={token ? <Task /> : <Navigate to="/" />}
          />
          <Route
            path="/addtask/:id"
            element={token ? <Task /> : <Navigate to="/" />}
          />
          <Route
            path="/"
            element={
              token ? (
                <Navigate to="/dashboard" />
              ) : (
                <LoginUser onLogin={setToken} exact />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
