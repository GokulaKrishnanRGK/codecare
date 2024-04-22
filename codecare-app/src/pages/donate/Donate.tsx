import { ResponseObject } from "../../models/ResponseObject.ts";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import TextField from "@mui/material/TextField";
import MyButton from "../../utils/MyButton.tsx";
import * as React from "react";
import * as donationService from '../../services/donation-service.ts';
import donateImage from './../../assets/donate_img1.jpg';
import { useSelector } from "react-redux";
import { getUser } from "../../store/loginUser-slice.ts";


export default function Donate() {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        donationService.donate(data).then((response: ResponseObject<any>) => {
            window.location.href = response.data.url
        });
    }

    const user = useSelector(getUser());

    const userExists = Object.keys(user).length !== 0;


    return (
        <Grid container component="main" sx={{
            height: '100vh',
            backgroundImage: `url(${donateImage})`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}>
            <CssBaseline />
            <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square sx={{
                m: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                backgroundColor: 'rgba(255, 255, 255, 0.97)',
            }}>
                <Box sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <HealthAndSafetyOutlinedIcon />
                    </Avatar>
                    {userExists ? (
                        <>
                            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                                <Typography component='h1' variant="h5" align='center'>Donation</Typography>
                                <Typography> Name : {user.firstname} {user.lastname}</Typography>
                                <Typography> Email : {user.username}</Typography>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="amount"
                                    label="Amount"
                                    name="amount"
                                    autoComplete="amount"
                                    autoFocus
                                />
                                <Grid container justifyContent="flex-end" alignItems="center" spacing={1} position="relative"
                                    right="127px">
                                    <Grid item>
                                        <MyButton
                                            type="submit"
                                            variant="contained"
                                            label="Donate"
                                        />
                                    </Grid>
                                </Grid>
                                <Typography variant="caption" sx={{
                                mt: 2,
                                display: 'block',
                                fontFamily: 'Graze, Arial, sans-serif', // Assuming Graze is the correct name; replace it if necessary
                                color: 'text.secondary'
                            }}>
                                * The amount is used for medical campaigns and research.
                            </Typography>
                            </Box>
                        </>
                    ) : (
                        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <Typography component="h3" variant="h5" align='center'>
                                Welcome, Caring Contributor
                            </Typography>
                            <Typography component='h1' variant="h5" align='center'>Donation</Typography>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="amount"
                                label="Amount"
                                name="amount"
                                autoComplete="amount"
                                autoFocus
                            />
                            <Grid container justifyContent="flex-end" alignItems="center" spacing={1} position="relative"
                                right="127px">
                                <Grid item>
                                    <MyButton
                                        type="submit"
                                        variant="contained"
                                        label="Donate"
                                    />
                                </Grid>
                            </Grid>
                            <Typography variant="caption" sx={{
                                mt: 2,
                                display: 'block',
                                fontFamily: 'Graze, Arial, sans-serif', // Assuming Graze is the correct name; replace it if necessary
                                color: 'text.secondary'
                            }}>
                                * The amount is used for medical campaigns and research.
                            </Typography>

                        </Box>
                    )}
                </Box>
            </Grid>
        </Grid>
    );
}