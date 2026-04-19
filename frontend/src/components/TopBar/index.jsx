import React, { useState, useEffect, useContext } from "react";
import { AppBar, Toolbar, Typography, Box, Checkbox, FormControlLabel } from "@mui/material";
import { AdvancedFeaturesContext } from "../../AdvancedFeaturesContext";
import { useLocation, matchPath } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

import "./styles.css";

/**
 * Define TopBar, a React component of Project 4.
 */
function TopBar() {
  const location = useLocation();
  const [context, setContext] = useState("");
  const { advancedFeaturesEnabled, setAdvancedFeaturesEnabled } = useContext(AdvancedFeaturesContext);

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

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit">
          Đào Hoàng Thái B23DCCN741
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
        <Typography variant="h5" color="inherit">
          {context}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
