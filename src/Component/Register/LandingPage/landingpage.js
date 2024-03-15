
import './landingpage.css'
import BgVideo from '../media/md.mp4'
import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Link } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Landingpage = () => {
    const defaultTheme = createTheme();

    const [formData, setFormData] = useState({
      firstName: '',
   
      email: '',
      password: '',
      role: '', // Added role to the form data
     
    });
  
    const [errors, setErrors] = useState({});
  
    const validateForm = () => {
      const newErrors = {};
  
      // Basic validation example, you can add more specific checks based on your requirements
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First Name is required';
      }
   
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.password.trim()) {
        newErrors.password = 'Password is required';
      }
      if (!formData.role.trim()) {
        newErrors.role = 'User Role is required';
      }
  
      setErrors(newErrors);
  
      // Return true if there are no errors
      return Object.keys(newErrors).length === 0;
    };
  
    const handleChange = (event) => {
      setFormData({
        ...formData,
        [event.target.name]: event.target.value,
      });
    };
  
    const handleCheckboxChange = (event) => {
      setFormData({
        ...formData,
        [event.target.name]: event.target.checked,
      });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (validateForm()) {
        try {
          // Send form data to the backend using axios or fetch
          const response = await axios.post('http://localhost:3000/register', formData);
  
          // Handle the response (e.g., redirect, show success message, etc.)
          if (response.status === 201) {
          //  toast('Register Successfully');
            toast.error('🦄Register Successfully', {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
              // transition: Bounce,
              });
            // Clear the form fields
            setFormData({
              firstName: '',
             
              email: '',
              password: '',
              role: '',
            
            });
          }
        } catch (error) {
          // Handle errors (e.g., show error message)
          console.error('Error submitting form:', error);
        }
      }
    };
    return (
        <div className="landingpage">
            <video src={BgVideo} autoPlay muted loop class="video-bg" />
            <div className="bg-overlay"></div>

          

            <div className="home-text">
                <h4>Stock Management</h4>
                <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs" className='reg-page' color="red">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }} />
            <Typography component="h1" variant="h5" sx={{ color: 'white'}}>
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} >
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    value={formData.firstName}
                    onChange={handleChange}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                    InputLabelProps={{
                      style: { color: 'white' } // Change label color to blue
                    }}
                    inputProps={{
                        style: { color: 'red' ,fontWeight:'bolder'} // Change text color to blue
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white' // Change border color to white
                        },
                        '&:hover fieldset': {
                          borderColor: 'white' // Change border color on hover to white
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white' // Change border color when focused to white
                        }
                      }
                    }}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                    inputProps={{
                        style: { color: 'red' ,fontWeight:'bolder'} // Change text color to blue
                    }}
                  />
                </Grid> */}
                <Grid item xs={12}>
                <FormControl fullWidth sx={{ width: '100%'}}>
                    <InputLabel id="demo-simple-select-label"  >User Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="role"
                      value={formData.role}
                      label="User Role"
                      onChange={handleChange}
                      error={!!errors.role}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: 'white' // Change border color to white
                          },
                          '&:hover fieldset': {
                            borderColor: 'white' // Change border color on hover to white
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: 'white' // Change border color when focused to white
                          }
                        }
                      }}
                     
                      inputProps={{
                        style: { color: 'red' } // Change dropdown text color to blue
                    }}
                 
                    >
                      <MenuItem value="1" >Admin</MenuItem>
                      {/* <MenuItem value="2">User</MenuItem> */}
                      <MenuItem value="3">User</MenuItem>
                    </Select>
                    <div style={{ color: 'red', marginTop: '5px', borderBlockColor:'white'}}>{errors.role}</div>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    inputProps={{
                        style: { color: 'red' ,fontWeight:'bolder' } // Change text color to blue
                    }}
                    InputLabelProps={{
                      style: { color: 'white' } // Change label color to blue
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white' // Change border color to white
                        },
                        '&:hover fieldset': {
                          borderColor: 'white' // Change border color on hover to white
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white' // Change border color when focused to white
                        }
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    inputProps={{
                        style: { color: 'red' ,fontWeight:'bolder'} // Change text color to blue
                    }}
                    InputLabelProps={{
                      style: { color: 'white' } // Change label color to blue
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'white' // Change border color to white
                        },
                        '&:hover fieldset': {
                          borderColor: 'white' // Change border color on hover to white
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: 'white' // Change border color when focused to white
                        }
                      }
                    }}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end"  sx={{color:'white'}}>
                <Grid item>
                  <Link to="/"  >Already have an account? Sign in</Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <ToastContainer />
        </Container>
      </ThemeProvider>
            </div>

      

        </div>
    )
}

export default Landingpage;