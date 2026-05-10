import React, { useState, useEffect } from "react";
import { Typography, List, ListItem, ListItemText, Divider, ListItemAvatar, Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";

const formatDate = (dateString) => {
  const d = new Date(dateString);
  const weekday = d.toLocaleString('en-US', { weekday: 'short' });
  const month = d.toLocaleString('en-US', { month: 'short' });
  const day = d.getDate();
  const year = d.getFullYear();
  const hour = d.getHours().toString().padStart(2, '0');
  const minute = d.getMinutes().toString().padStart(2, '0');
  return `${weekday}, ${month} ${day} ${year} ${hour}:${minute}`;
};

function UserComments() {
  const { userId } = useParams();
  const [comments, setComments] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchModel(`/user/${userId}`)
      .then(data => setUser(data))
      .catch(err => console.error("Error fetching user details:", err));

    fetchModel(`/commentsOfUser/${userId}`)
      .then(data => setComments(data))
      .catch(err => console.error("Error fetching user comments:", err));
  }, [userId]);

  if (!comments || !user) {
    return <Typography variant="h6" sx={{ padding: 2 }}>Loading...</Typography>;
  }

  if (comments.length === 0) {
    return <Typography variant="h6" sx={{ padding: 2 }}>No comments found.</Typography>;
  }

  return (
    <div>
      <Typography variant="h6" sx={{ padding: 2 }}>Comments by {user.first_name} {user.last_name}</Typography>
      <Divider />
      <List>
        {comments.map(c => (
          <React.Fragment key={c._id}>
            <ListItem
              alignItems="flex-start"
              component={Link}
              to={`/photos/${c.photo_owner._id || c.photo_owner}/${c.photo_id}`}
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
                primary={<>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {user.first_name} {user.last_name}
                  </Typography>
                  {c.comment}
                </>}
                secondary={formatDate(c.date_time)}
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
