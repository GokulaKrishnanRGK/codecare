import { Box, Paper, Skeleton, Typography } from "@mui/material";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import { useGetDonationStatsQuery } from "../../store/api/donationApi";

export default function DonationFlyer(): JSX.Element {
  const { data, isLoading, isError, refetch } = useGetDonationStatsQuery();
  const total = data?.totalDonations ?? 0;

  return (
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <VolunteerActivismIcon />
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6">Community Donations</Typography>
            <Typography variant="body2" color="text.secondary">
              Total collected so far
            </Typography>
          </Box>

          <Box sx={{ textAlign: "right" }}>
            {isLoading ? (
                <Skeleton width={120} height={40} />
            ) : (
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  ${total.toLocaleString()}
                </Typography>
            )}

            {isError && (
                <Typography
                    variant="caption"
                    color="error"
                    sx={{ cursor: "pointer", display: "block" }}
                    onClick={() => refetch()}
                >
                  Failed to load — click to retry
                </Typography>
            )}
          </Box>
        </Box>
      </Paper>
  );
}
