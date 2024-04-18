import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typewriter from 'typewriter-effect';
import { useNavigate } from 'react-router-dom';
import * as authService from '../services/auth-service.ts';
import {LoginDO} from "../models/LoginDO.ts";
import {getUser, loadLoginUser} from "../store/loginUser-slice.ts";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../store";
import {ResponseObject} from "../models/ResponseObject.ts";

//Utilities
import MyButton from '../utils/MyButton';


const Copyright=(props: any) =>{
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const options={
    strings: ['Welcome', 'To','CodeCare!!'],
    autoStart: true,
    loop: true,
};


const backgroundTemplate={
    backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
    backgroundRepeat: 'no-repeat',
    backgroundColor: (t:any) =>
    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center', // Center vertically
    justifyContent: 'center', // Center horizontally
    height: '100%', // Make sure the Grid item takes full height
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignIn() {

  const navigate=useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(getUser());

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    authService.login(data).then((response: ResponseObject<LoginDO>) => {
        if(response.data) {
            localStorage.setItem('token', response.data.token);
            dispatch(loadLoginUser(response.data.user));
        } else {
            alert(response.error);
        }
    });
  };




  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{...backgroundTemplate}}
            >
            <Box sx={{ color: 'white' }}>
                <Typography variant="h1">
                <Typewriter
                        options={{...options}}
                        />
                </Typography>
            </Box>
        </Grid>

        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form"  onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            <Grid container justifyContent="flex-end" alignItems="center" spacing={1} position="relative" right="100px">
                <Grid item>
                <MyButton
                    type="submit"
                    variant="contained"
                    label="Sign In"
                />

                </Grid>
                <Grid item>

                <MyButton
                label='Register'
                variant='contained'
                onClick={()=>navigate(`/Signup`)}
                />
                
                </Grid>
            </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}