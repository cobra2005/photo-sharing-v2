import React, { useState } from 'react';
import { Typography, TextField, Button, Grid, Paper, Snackbar, Alert } from '@mui/material';
import axios from 'axios';

const LoginRegister = ({ onLogin }) => {
  const [loginName, setLoginName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register state
  const [regLoginName, setRegLoginName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regPassword2, setRegPassword2] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regLocation, setRegLocation] = useState('');
  const [regDescription, setRegDescription] = useState('');
  const [regOccupation, setRegOccupation] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('/admin/login', { login_name: loginName }, {
        withCredentials: true
      });
      onLogin(res.data);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async () => {
    if (regPassword !== regPassword2) {
      setErrorMsg('Passwords do not match');
      return;
    }
    try {
      await axios.post('/user', {
        login_name: regLoginName,
        password: regPassword,
        first_name: regFirstName,
        last_name: regLastName,
        location: regLocation,
        description: regDescription,
        occupation: regOccupation
      });
      setSuccessMsg('Registration successful! You can now login.');
      setRegLoginName(''); setRegPassword(''); setRegPassword2('');
      setRegFirstName(''); setRegLastName(''); setRegLocation('');
      setRegDescription(''); setRegOccupation('');
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h5">Login</Typography>
          <TextField label="Login Name" fullWidth margin="normal" value={loginName} onChange={e => setLoginName(e.target.value)} />
          <Button variant="contained" color="primary" onClick={handleLogin}>Login</Button>
        </Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper style={{ padding: '20px' }}>
          <Typography variant="h5">Register</Typography>
          <TextField label="Login Name" fullWidth margin="normal" value={regLoginName} onChange={e => setRegLoginName(e.target.value)} />
          <TextField label="Password" type="password" fullWidth margin="normal" value={regPassword} onChange={e => setRegPassword(e.target.value)} />
          <TextField label="Confirm Password" type="password" fullWidth margin="normal" value={regPassword2} onChange={e => setRegPassword2(e.target.value)} />
          <TextField label="First Name" fullWidth margin="normal" value={regFirstName} onChange={e => setRegFirstName(e.target.value)} />
          <TextField label="Last Name" fullWidth margin="normal" value={regLastName} onChange={e => setRegLastName(e.target.value)} />
          <TextField label="Location" fullWidth margin="normal" value={regLocation} onChange={e => setRegLocation(e.target.value)} />
          <TextField label="Description" fullWidth margin="normal" value={regDescription} onChange={e => setRegDescription(e.target.value)} />
          <TextField label="Occupation" fullWidth margin="normal" value={regOccupation} onChange={e => setRegOccupation(e.target.value)} />
          <Button variant="contained" color="secondary" onClick={handleRegister}>Register Me</Button>
        </Paper>
      </Grid>

      <Snackbar open={!!errorMsg} autoHideDuration={6000} onClose={() => setErrorMsg('')}>
        <Alert onClose={() => setErrorMsg('')} severity="error">{errorMsg}</Alert>
      </Snackbar>
      <Snackbar open={!!successMsg} autoHideDuration={6000} onClose={() => setSuccessMsg('')}>
        <Alert onClose={() => setSuccessMsg('')} severity="success">{successMsg}</Alert>
      </Snackbar>
    </Grid>
  );
};

export default LoginRegister;