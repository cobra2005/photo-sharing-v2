import React, { useState, useEffect, useContext } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Badge
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

import "./styles.css";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../AdvancedFeaturesContext";

/**
 * Define UserList, a React component of Project 4.
 */
function UserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const { advancedFeaturesEnabled } = useContext(AdvancedFeaturesContext);

  useEffect(() => {
    fetchModel("/user/list")
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching user list:", err));
  }, []);

  return (
    <div>
      <Typography variant="h6" sx={{ padding: 2 }}>
        User List
      </Typography>
      <Divider />
      <List component="nav">
        {users.map((item) => (
          <React.Fragment key={item._id}>
            <ListItem disablePadding>
              <ListItemButton component={Link} to={`/users/${item._id}`}>
                <ListItemText primary={`${item.first_name} ${item.last_name}`} />
                {advancedFeaturesEnabled && (
                  <>
                    <Badge badgeContent={item.photo_count || 0} color="success" sx={{ mx: 2 }} />
                    <Badge badgeContent={item.comment_count || 0} color="error"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        navigate(`/comments/${item._id}`);
                      }}
                    />
                  </>
                )}
              </ListItemButton>
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserList;
