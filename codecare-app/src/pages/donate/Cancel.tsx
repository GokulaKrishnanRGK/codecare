import { Typography } from "@mui/material";

export default function Cancel() {
    return (
        <div style={{ marginTop: 20, padding: 20 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Cancelled!
            </Typography>
            <Typography variant="body1">
                Your transaction was cancelled.
            </Typography>
        </div>
    );
}
