import React, { useState, useEffect, useContext } from "react";
import { Typography, Card, CardHeader, CardMedia, CardContent, Divider, List, ListItem, ListItemText, Button, Box } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import fetchModel from "../../lib/fetchModelData";
import { AdvancedFeaturesContext } from "../../AdvancedFeaturesContext";

import "./styles.css";

/**
 * Define UserPhotos, a React component of Project 4.
 */
function UserPhotos() {
  const { userId, photoId } = useParams();
  const navigate = useNavigate();
  const [photos, setPhotos] = useState(null);
  const { advancedFeaturesEnabled } = useContext(AdvancedFeaturesContext);

  useEffect(() => {
    fetchModel(`/photosOfUser/${userId}`)
      .then(data => setPhotos(data))
      .catch(err => console.error(err));
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
            title={<Typography variant="subtitle1" color="textSecondary">{photo.date_time}</Typography>}
          />
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
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
                              {comment.date_time}
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
            title={<Typography variant="subtitle1" color="textSecondary">{photo.date_time}</Typography>}
          />
          <CardMedia
            component="img"
            image={`/images/${photo.file_name}`}
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
                              {comment.date_time}
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default UserPhotos;
