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
import Roles from "../../models/auth/Roles";
import {toPublicImageUrl} from "../../utils/image-url.ts";
import RoleGate from "../Auth/RoleGate.tsx";
import {Chip, Stack} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
  const imgUrl = toPublicImageUrl(event.eventImage) ?? "/images/pwa-192x192.png";

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

  const isComplete = useMemo(() => new Date(event.endTime).getTime() < Date.now(), [event.endTime]);

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
              sx={{objectFit: "cover", backgroundColor: "grey.100"}}
          />

          {event.isRegistered && (
              <Chip
                  icon={<CheckCircleIcon/>}
                  label="Registered"
                  color="success"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: 8,
                    fontWeight: 600,
                  }}
              />
          )}

          <RoleGate allowedRoles={[Roles.ADMIN]}>
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
          </RoleGate>
        </Box>

        <CardContent sx={{flexGrow: 1}}>
          <Typography component="h2" variant="h6" sx={{mb: 0.5}}>
            {event.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
            {formatDateTime(event.date)} to {formatDateTime(event.endTime)}{" "}
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
        <Stack direction="row" spacing={1} sx={{mt: 1, flexWrap: "wrap", px: 2}}>
          <Chip size="small" label={`Registered: ${event.registeredCount}`}/>
          {isComplete && (
              <Chip size="small" label={`Attended: ${event.attendedCount}`}/>
          )}
        </Stack>
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
