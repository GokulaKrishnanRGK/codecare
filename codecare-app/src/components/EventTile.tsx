import Event from "../models/Event.ts";
import CardActionArea from "@mui/material/CardActionArea";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import * as eventService from "../services/event-service.ts";

interface Eventprops {
    event: Event,
    eventID: string
}

const handleDelete = (e: MouseEvent, id) => {
    e.stopPropagation();
    eventService.deleteEvent(id);
}

export default function EventTile(props: Eventprops) {
    const event = props.event
    return (
        <CardActionArea component="a">
            <IconButton aria-label="delete" size="large" onClick={(e) => handleDelete(e, props.eventID)}>
                <DeleteIcon />
            </IconButton>
            <Card sx={{ display: 'flex' }}>
                <CardContent sx={{ flex: 1 }}>
                    <Typography component="h2" variant="h5">
                        {event.title}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        {new Date(event.date).toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1" paragraph>
                        {event.description}
                    </Typography>
                    <Typography variant="subtitle1" color="primary">
                        Continue reading...
                    </Typography>
                </CardContent>
            </Card>
        </CardActionArea>
    );
}