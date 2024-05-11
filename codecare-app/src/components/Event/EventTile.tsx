import * as React from "react";
import {useMemo} from "react";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import type Event from "../../models/events/Event";
import * as authUtil from "../../utils/auth-util";
import Roles from "../../models/auth/Roles";
import {toPublicImageUrl} from "../../utils/image-url.ts";
import {useMeQuery} from "../../store/api/meApi.ts";
import {useAuth} from "@clerk/clerk-react";
import {skipToken} from "@reduxjs/toolkit/query";

interface EventTileProps {
  event: Event;
  onOpen: (id: string) => void;
  onRequestDelete: (id: string) => void;
}

function formatDateTime(dateIso: string): string {
  return new Date(dateIso).toLocaleString();
}

export default function EventTile(props: Readonly<EventTileProps>): JSX.Element {
  const {event, onOpen, onRequestDelete} = props;
  const { isSignedIn } = useAuth();
  const { data: user } = useMeQuery(isSignedIn ? undefined : skipToken);

  const imgUrl = toPublicImageUrl(event.eventImage) ?? "/images/pwa-192x192.png";

  const canDelete = useMemo(
      () => authUtil.isUserInRole(user, [Roles.ADMIN]),
      [user]
  );

  const handleOpen = (): void => onOpen(event.id);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpen();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onRequestDelete(event.id);
  };

  const altText = event.title
      ? `Flyer for event: ${event.title}`
      : "Event flyer";

  return (
      <Card
          role="button"
          tabIndex={0}
          onClick={handleOpen}
          onKeyDown={handleKeyDown}
          aria-label={`Open event ${event.title}`}
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            outline: "none",
            "&:focus-visible": {
              boxShadow: (theme) => `0 0 0 3px ${theme.palette.primary.main}`,
            },
          }}
      >
        <Box sx={{position: "relative"}}>
          <CardMedia
              component="img"
              height="170"
              image={imgUrl}
              alt={altText}
              loading="lazy"
              sx={{ objectFit: "cover", backgroundColor: "grey.100" }}
          />

          {canDelete && (
              <IconButton
                  aria-label={`Delete event ${event.title}`}
                  onClick={handleDeleteClick}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255,255,255,0.85)",
                    "&:hover": {backgroundColor: "rgba(255,255,255,1)"},
                  }}
              >
                <DeleteIcon/>
              </IconButton>
          )}
        </Box>

        <CardContent sx={{flexGrow: 1}}>
          <Typography component="h2" variant="h6" sx={{mb: 0.5}}>
            {event.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
            {formatDateTime(event.date)}
          </Typography>

          <Typography
              variant="body2"
              sx={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
          >
            {event.description}
          </Typography>
        </CardContent>

        <CardActions sx={{pt: 0, px: 2, pb: 2}}>
          <Button size="small" onClick={(e) => {
            e.stopPropagation();
            handleOpen();
          }}>
            View details
          </Button>
        </CardActions>
      </Card>
  );
}
