import { Box } from "@mui/material";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";
import { findById } from "../../store/event-slice.ts"
import React, {useState} from "react";
import EditEvent from "./EditEvent.tsx";
import {getUser} from "../../store/loginUser-slice.ts";
import * as authUtil from "../../utils/auth-util.ts";
import Roles from "../../models/Roles.ts";
import { ArrowBackRounded } from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";

function Event() {
    const { id } = useParams();
    const navigate = useNavigate();
    const event = useSelector(findById(id));
    const [editable, setEditable] = useState(false);
    const user = useSelector(getUser());

    return (
        <Box sx={{minWidth: 275}}>
            <Card variant="outlined">
                <CardActions>
                    <IconButton onClick={() => navigate('/events')}>
                        <ArrowBackRounded/>
                    </IconButton>
                {
                    authUtil.isUserInRole(user, [Roles.ADMIN]) ?
                        (<>
                            <Button size="medium" onClick={() => setEditable(!editable)}>{(editable) ? ("Cancel Edit") : ("Edit Event") }</Button>
                        </>
                        )
                        :
                        (<></>)
                }
                </CardActions>
                <CardContent>
                    {event ? (
                        editable ? (
                            <EditEvent editEvent={event} id={id}/>
                        ) : (
                            <div>
                                <Typography variant="h2" gutterBottom>
                                    {event.title}
                                </Typography>
                                <div className="eventImageContainer">
                                    <img src={event.eventImage}/>
                                </div>
                                <br/> <br/>
                                <div>
                                    <Typography variant="h6" gutterBottom>
                                        <strong>Organized by:</strong> {event.organizer} <br/>
                                        <strong>Date:</strong> {new Date(event.date).toLocaleString()}
                                    </Typography> <br/> <br/>
                                    <Typography variant="h5" gutterBottom>
                                        {event.description}
                                    </Typography> <br/> <br/>
                                    <Typography variant="body1">
                                        <strong>Location:</strong> &nbsp;{event.location.address}, {event.location.city} {event.location.postalCode}
                                        <br/>
                                        <strong>Contact:</strong> &nbsp;{event.contactInfo}
                                    </Typography>
                                </div>
                            </div>
                        )
                    ) : (
                        <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
                            Event not found
                        </Typography>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
}

export default Event;