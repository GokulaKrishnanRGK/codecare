import {ResponseObject} from "../../models/ResponseObject.ts";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import TextField from "@mui/material/TextField";
import MyButton from "../../utils/MyButton.tsx";
import * as React from "react";
import * as donationService from '../../services/donation-service.ts';

export default function Donate() {

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        donationService.donate(data).then((response: ResponseObject<any>) => {
            window.location.href = response.data.url
        });
    }

    return (
        <Grid container component="main" sx={{height: '100vh'}}>
            <CssBaseline/>

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
                    <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Donation
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} sx={{mt: 1}}>
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
                              right="100px">
                            <Grid item>
                                <MyButton
                                    type="submit"
                                    variant="contained"
                                    label="Donate"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
        </Grid>
    )
}