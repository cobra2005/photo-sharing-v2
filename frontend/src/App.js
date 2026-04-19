import './App.css';

import React, { useState } from "react";
import { Grid, Paper } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AdvancedFeaturesContext } from "./AdvancedFeaturesContext";

import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import UserComments from "./components/UserComments";

const App = (props) => {
  const [advancedFeaturesEnabled, setAdvancedFeaturesEnabled] = useState(false);

  return (
    <AdvancedFeaturesContext.Provider value={{ advancedFeaturesEnabled, setAdvancedFeaturesEnabled }}>
      <Router>
        <div>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TopBar />
            </Grid>
            <div className="main-topbar-buffer" />
            <Grid item sm={3}>
              <Paper className="main-grid-item">
                <UserList />
              </Paper>
            </Grid>
            <Grid item sm={9}>
              <Paper className="main-grid-item">
                <Routes>
                  <Route
                    path="/users/:userId"
                    element={<UserDetail />}
                  />
                  <Route
                    path="/photos/:userId"
                    element={<UserPhotos />}
                  />
                  <Route
                    path="/photos/:userId/:photoId"
                    element={<UserPhotos />}
                  />
                  <Route
                    path="/comments/:userId"
                    element={<UserComments />}
                  />
                  <Route path="/users" element={<UserList />} />
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
