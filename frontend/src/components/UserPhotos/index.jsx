import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, CardHeader, CardMedia, CardContent, Divider, List, ListItem, ListItemText, Button, Box, TextField } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../AdvancedFeaturesContext";
import axios from "axios";

import "./styles.css";

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

const AddComment = ({ photoId, onCommentAdded }) => {
  const [comment, setComment] = useState('');
  const handleAdd = async () => {
    try {
      await axios.post(`http://localhost:8081/commentsOfPhoto/${photoId}`, { comment }, { withCredentials: true });
      setComment('');
      onCommentAdded();
    } catch (e) {
      console.error(e);
    }
  };
  return (
    <Box sx={{ display: 'flex', marginTop: 2, gap: 1 }}>
      <TextField size="small" fullWidth placeholder="Add a comment..." value={comment} onChange={e => setComment(e.target.value)} />
      <Button variant="contained" onClick={handleAdd} disabled={!comment.trim()}>Post</Button>
    </Box>
  );
};

function UserPhotos() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState(null);
  const { advancedFeaturesEnabled } = useContext(AdvancedFeaturesContext);

  const loadPhotos = () => {
    fetchModel(`/photosOfUser/${userId}`)
      .then(data => setPhotos(data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    loadPhotos();
  }, [userId]);

  if (!photos) {
    return <Typography variant="h6" sx={{ padding: 2 }}>Loading...</Typography>;
  }

  if (photos.length === 0) {
    return <Typography variant="h6" sx={{ padding: 2 }}>No photos found for this user.</Typography>;
  }

  if (advancedFeaturesEnabled) {
    let currentIndex = 0;
    if (photoId) {
      const idx = photos.findIndex(p => p._id === photoId);
      if (idx !== -1) currentIndex = idx;
    }
    const photo = photos[currentIndex];

    return (
      <div style={{ padding: 16 }}>
        <Card sx={{ marginBottom: 4 }}>
          <CardHeader
            title={<Typography variant="subtitle1" color="textSecondary">{formatDate(photo.date_time)}</Typography>}
          />
          <CardMedia
            component="img"
            image={`http://localhost:8081/images/${photo.file_name}`}
            alt={photo.file_name}
            sx={{ maxWidth: "100%", objectFit: "contain" }}
          />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
              <Button
                variant="contained"
                disabled={currentIndex === 0}
                onClick={() => navigate(`/photos/${userId}/${photos[currentIndex - 1]._id}`)}
              >
                Previous
              </Button>
              <Button
                variant="contained"
                disabled={currentIndex === photos.length - 1}
                onClick={() => navigate(`/photos/${userId}/${photos[currentIndex + 1]._id}`)}
              >
                Next
              </Button>
            </Box>
            <Typography variant="h6" gutterBottom>Comments</Typography>
            <Divider />
            {photo.comments && photo.comments.length > 0 ? (
              <List>
                {photo.comments.map(comment => (
                  <React.Fragment key={comment._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                              {comment.user.first_name} {comment.user.last_name}
                            </Link>
                            <span style={{ color: "gray", fontSize: "0.85em", marginLeft: 8 }}>
                              {formatDate(comment.date_time)}
                            </span>
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="textPrimary" sx={{ marginTop: 1 }}>
                            {comment.comment}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                No comments yet.
              </Typography>
            )}
            <AddComment photoId={photo._id} onCommentAdded={loadPhotos} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {photos.map(photo => (
        <Card key={photo._id} sx={{ marginBottom: 4 }}>
          <CardHeader
            title={<Typography variant="subtitle1" color="textSecondary">{formatDate(photo.date_time)}</Typography>}
          />
          <CardMedia
            component="img"
            image={`http://localhost:8081/images/${photo.file_name}`}
            alt={photo.file_name}
            sx={{ maxWidth: "100%", objectFit: "contain" }}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>Comments</Typography>
            <Divider />
            {photo.comments && photo.comments.length > 0 ? (
              <List>
                {photo.comments.map(comment => (
                  <React.Fragment key={comment._id}>
                    <ListItem alignItems="flex-start">
                      <ListItemText
                        primary={
                          <Typography variant="subtitle2">
                            <Link to={`/users/${comment.user._id}`} style={{ textDecoration: 'none', color: '#1976d2' }}>
                              {comment.user.first_name} {comment.user.last_name}
                            </Link>
                            <span style={{ color: "gray", fontSize: "0.85em", marginLeft: 8 }}>
                              {formatDate(comment.date_time)}
                            </span>
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2" color="textPrimary" sx={{ marginTop: 1 }}>
                            {comment.comment}
                          </Typography>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="textSecondary" sx={{ marginTop: 2 }}>
                No comments yet.
              </Typography>
            )}
            <AddComment photoId={photo._id} onCommentAdded={loadPhotos} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
