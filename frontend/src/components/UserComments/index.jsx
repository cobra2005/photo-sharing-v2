import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText, Divider, ListItemAvatar, Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState(null);

  useEffect(() => {
    fetchModel(`/commentsOfUser/${userId}`)
      .then(data => setComments(data))
      .catch(err => console.error("Error fetching user comments:", err));
  }, [userId]);

  if (!comments) {
    return <Typography variant="h6" sx={{ padding: 2 }}>Loading...</Typography>;
  }

  if (comments.length === 0) {
    return <Typography variant="h6" sx={{ padding: 2 }}>No comments found.</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" sx={{ padding: 2 }}>User Comments</Typography>
      <Divider />
      <List>
        {comments.map(c => (
          <React.Fragment key={c._id}>
            <ListItem
              alignItems="flex-start"
              component={Link}
              to={`/photos/${c.photo_owner}/${c.photo_id}`}
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              <ListItemAvatar>
                <Avatar
                  variant="square"
                  src={`/images/${c.photo_file_name}`}
                  alt={c.photo_file_name}
                  sx={{ width: 80, height: 80, mr: 2, '& img': { objectFit: 'contain' } }}
                />
              </ListItemAvatar>
              <ListItemText
                primary={c.comment}
                secondary={new Date(c.date_time).toLocaleString()}
              />
            </ListItem>
            <Divider />
          </React.Fragment>
        ))}
      </List>
    </div>
  );
}

export default UserComments;
