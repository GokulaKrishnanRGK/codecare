import * as React from "react";
import {Box, IconButton, Tooltip, Typography} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

type Props = {
  title?: string;
  left?: React.ReactNode;
  onRefresh: () => void;
  isRefreshing?: boolean;
  refreshLabel?: string;
  right?: React.ReactNode;
};

export default function ListToolbar({
                                      title,
                                      left,
                                      onRefresh,
                                      isRefreshing = false,
                                      refreshLabel = "Refresh",
                                      right,
                                    }: Readonly<Props>) {
  return (
      <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            mb: 2,
            flexWrap: "wrap",
          }}
      >
        <Box sx={{display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap"}}>
          {right}
          {title ? <Typography variant="h6">{title}</Typography> : null}
          {left}
        </Box>

        <Tooltip title={refreshLabel}>
          <span>
          <IconButton
              onClick={onRefresh}
              disabled={isRefreshing}
              size="small"
              aria-label={refreshLabel}
          >
            <RefreshIcon/>
          </IconButton>
        </span>
        </Tooltip>
      </Box>
  );
}
