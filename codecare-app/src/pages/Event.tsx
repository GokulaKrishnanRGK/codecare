import { Box } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { findById } from "../store/event-slice.ts";

function Event() {
    const { id } = useParams();
    const navigate = useNavigate();
    const event = useSelector(findById(id));
    return (
        <Box sx={{ minWidth: 275 }}>
            <Card variant="outlined">
                <CardContent>
                    { event ? (<>
                        <Typography variant="h1" gutterBottom>
                           {event.title}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Organized by: {event.organizer} <br/>
                            Date: {new Date(event.date).toLocaleString()}
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            {event.description} <br/>
                        </Typography>
                        <Typography variant="body1">
                            Location: &nbsp;{event.location.address}, {event.location.city} {event.location.postalCode} <br />
                            Contact: &nbsp;{event.contactInfo}
                        </Typography>
                    </>) : (
                        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                            Event not found
                        </Typography>
                    )}
                </CardContent>
                <CardActions>
                    <Button size="small" onClick={() => navigate(`/events`)}>Back</Button>
                </CardActions>
            </Card>
        </Box>
    );
}

export default Event;