import Event from "../models/Event.ts";
import CardActionArea from "@mui/material/CardActionArea";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import * as eventService from "../services/event-service.ts";
import * as authUtil from "../utils/auth-util.ts";
import Roles from "../models/Roles.ts";
import {useDispatch, useSelector} from "react-redux";
import {getUser} from "../store/loginUser-slice.ts";
import {AppDispatch} from "../store";
import {loadEvents} from "../store/event-slice.ts";

interface Eventprops {
    event: Event,
    eventID: string
}

export default function EventTile(props: Eventprops) {
    const event = props.event
    const user = useSelector(getUser());
    const dispatch = useDispatch<AppDispatch>();

    const handleDelete = (e: MouseEvent, id) => {
        e.stopPropagation();
        eventService.deleteEvent(id).then(() => {
            eventService.searchEvents().then((event) => {
                dispatch(loadEvents(event));
            })
        });
    }

    return (
        <CardActionArea component="a">
            {
                authUtil.isUserInRole(user, [Roles.ADMIN]) ?
                    (<IconButton aria-label="delete" size="large" onClick={(e) => handleDelete(e, props.eventID)}>
                        <DeleteIcon />
                    </IconButton>)
                    :
                    (<></>)
            }
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