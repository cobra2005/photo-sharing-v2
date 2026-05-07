import './App.css';

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AdvancedFeaturesContext } from "./AdvancedFeaturesContext";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";
import LoginRegister from "./components/LoginRegister";

const App = (props) => {
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AdvancedFeaturesContext.Provider value={{ advancedFeaturesEnabled, setAdvancedFeaturesEnabled }}>
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar user={user} onLogout={handleLogout} />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                {user ? <UserList /> : null}
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  {user ? (
                    <>
                      <Route path="/users/:userId" element={<UserDetail />} />
                      <Route path="/photos/:userId" element={<UserPhotos />} />
                      <Route path="/photos/:userId/:photoId" element={<UserPhotos />} />
                      <Route path="/comments/:userId" element={<UserComments />} />
                      <Route path="/users" element={<UserList />} />
                      <Route path="*" element={<Navigate to={`/users/${user._id}`} />} />
                    </>
                  ) : (
                    <>
                      <Route path="/login-register" element={<LoginRegister onLogin={handleLogin} />} />
                      <Route path="*" element={<Navigate to="/login-register" />} />
                    </>
                  )}
                </Routes>
              </Paper>
            </Grid>
          </Grid>
        </div>
      </Router>
    </AdvancedFeaturesContext.Provider>
  );
}

export default App;
