import { Typography } from "@mui/material";

export default function Success() {
    return (
        <div style={{ marginTop: 20, padding: 20 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Success!
            </Typography>
            <Typography variant="body1">
                Your transaction was successful.
            </Typography>
        </div>
    );
}
