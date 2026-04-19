import React, { useState, useEffect } from "react";
import { Typography, Paper, Button, Divider } from "@mui/material";
import { Link, useParams } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";

/**
 * Define UserDetail, a React component of Project 4.
 */
function UserDetail() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then(data => setUser(data))
      .catch(err => console.error(err));
  }, [userId]);

  if (!user) {
    return <Typography variant="h6" sx={{ padding: 2 }}>Loading...</Typography>;
  }

  return (
    <Paper elevation={3} sx={{ padding: 3, margin: 2 }}>
      <Typography variant="h4" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>
      <Divider sx={{ marginBottom: 2 }} />
      <Typography variant="body1" paragraph>
        <b>Location:</b> {user.location}
      </Typography>
      <Typography variant="body1" paragraph>
        <b>Description:</b> <span dangerouslySetInnerHTML={{ __html: user.description }} />
      </Typography>
      <Typography variant="body1" paragraph>
        <b>Occupation:</b> {user.occupation}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        component={Link}
        to={`/photos/${user._id}`}
        sx={{ marginTop: 2 }}
      >
        View Photos
      </Button>
    </Paper>
  );
}

export default UserDetail;
