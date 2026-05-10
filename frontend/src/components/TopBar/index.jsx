import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, Box, Checkbox, FormControlLabel, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { AdvancedFeaturesContext } from "../../AdvancedFeaturesContext";
import { useLocation, matchPath, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import axios from "axios";

import "./styles.css";

function TopBar({ user, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [context, setContext] = useState("");
  const { advancedFeaturesEnabled, setAdvancedFeaturesEnabled } = useContext(AdvancedFeaturesContext);

  const [open, setOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  useEffect(() => {
    const userDetailMatch = matchPath("/users/:userId", location.pathname);
    const userPhotosMatch = matchPath("/photos/:userId", location.pathname);

    if (userDetailMatch) {
      fetchModel(`/user/${userDetailMatch.params.userId}`)
        .then(u => setContext(`${u.first_name} ${u.last_name}`))
        .catch(console.error);
    } else if (userPhotosMatch) {
      fetchModel(`/user/${userPhotosMatch.params.userId}`)
        .then(u => setContext(`Photos of ${u.first_name} ${u.last_name}`))
        .catch(console.error);
    } else {
      setContext("");
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.post("/admin/logout", {}, { withCredentials: true });
      onLogout();
      navigate("/login-register");
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) return;
    const formData = new FormData();
    formData.append("photo", uploadFile);
    try {
      await axios.post("/photos/new", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });
      setOpen(false);
      setUploadFile(null);
      // optionally refresh
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          {user ? `Hi ${user.first_name}` : "Please Login"}
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        <FormControlLabel
          control={
            <Checkbox
              checked={advancedFeaturesEnabled}
              onChange={(e) => setAdvancedFeaturesEnabled(e.target.checked)}
              sx={{ color: "white", "&.Mui-checked": { color: "white" } }}
            />
          }
          label={<Typography variant="body2" sx={{ marginRight: 2 }}>Enable Advanced Features</Typography>}
        />
        <Typography variant="h5" color="inherit" sx={{ marginRight: 2 }}>
          {context}
        </Typography>
        {user && (
          <>
            <Button color="inherit" onClick={() => setOpen(true)}>Add Photo</Button>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
      
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Upload a new photo</DialogTitle>
        <DialogContent>
          <input type="file" accept="image/*" onChange={e => setUploadFile(e.target.files[0])} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpload}>Upload</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
}

export default TopBar;
