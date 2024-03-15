import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Link } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import MainPage from "../Login/Main"
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    marginTop: '10px',
    padding: theme.spacing(2),
    textAlign: 'center',
    // color: theme.palette.text.secondary,
  },
}));




function Main() {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };



  const handleDialogOpen = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogType('');
  };
  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const userdata = localStorage.setItem('userData', JSON.stringify(data));
        console.log(userdata);
        if (data.role === '3') {
          // For staff login (role '1'), check approve_status
          if (data.loginstatus === '1') {
            // Only allow login if approve_status is '1'
            toast('Login successful');



            // Redirect to staffHome
            window.location = '/admin/purchaseDetails';
          } else {
            // Inform the user that login failed due to approve_status condition
            setError('Please contact admin');
          }
        } else {
          // For other roles, proceed with existing redirection logic
          toast('Login successful');



          // Redirect based on role
          switch (data.role) {
            case '1':
              window.location = '/admin/addProduct';
              break;
            case '2':
              window.location = '/admin/addRewards';
              break;
            default:
              // Handle unexpected role
              break;
          }
        }
      } else {
        // Handle login error
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setError('An unexpected error occurred');
    }
  };

  const containerStyle = {
    margin: '10px',
    // backgroundImage: url(${myImage}),
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    height: '90vh', // 100% of the viewport height
    width: '90vw', // 100% of the viewport width
    position: 'absolute',
  };


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{
          backgroundColor: "rgb(2,155,245)",


        }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >

          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Stock Market
          </Typography>



          <Button color="inherit" onClick={() => handleDialogOpen('1')}>Admin</Button>
          <Button color="inherit" onClick={() => handleDialogOpen('3')}>User</Button>
          <Button color="inherit" onClick={() => handleDialogOpen('2')}>Rewards</Button>
        </Toolbar>
      </AppBar>
      <div className="background-container" style={containerStyle}>
      </div>
      <div className='head'>

      </div>

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogType === 'admin' ? 'Admin Login' : 'Login'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <TextField
              label="Email"
              id="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              id="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
          <Button onClick={handleLogin} autoFocus>
            Login
          </Button>


        </DialogActions>
        <div className='reg-user'>
          <Link to="landingpage"> New User Registration?</Link>
        </div>

      </Dialog>
      <div className={classes.root}>
        <MainPage />
        {/* <Grid container >
        <Grid item xs={12}>
          <Paper className={classes.paper}><MainPage/></Paper>
        </Grid>
        {/* <Grid item xs={4}>
          <Paper className={classes.paper}></Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={classes.paper}>xs=6</Paper>
        </Grid> */}

        {/* </Grid> */}
        <ToastContainer />
      </div>
    </Box>

  )
}

export default Main
