import AuthGuard from "../../components/Auth/AuthGuard";
import Roles from "../../models/auth/Roles";
import {useGetMyProfileQuery, useUpdateMyEmailSubscriptionMutation} from "../../store/api/meApi";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ListToolbar from "../../components/common/ListToolbar";
import {InfinitySpin} from "react-loader-spinner";
import {useEffect, useState} from "react";

export default function Profile(): JSX.Element {
  const {data, isLoading, isFetching, isError, refetch} = useGetMyProfileQuery();

  const showLoader = isLoading || isFetching;

  const [updateSubscription, { isLoading: isSavingSub }] = useUpdateMyEmailSubscriptionMutation();
  const [subValue, setSubValue] = useState<"enabled" | "disabled">("enabled");

  useEffect(() => {
    if (!data) return;
    setSubValue(data.emailSubscribed ? "enabled" : "disabled");
  }, [data]);

  return (
      <AuthGuard allowedRoles={[Roles.USER, Roles.ADMIN, Roles.VOLUNTEER]}>
        <>
          <ListToolbar
              title="My Profile"
              onRefresh={refetch}
              isRefreshing={showLoader}
              refreshLabel="Refresh profile"
          />

          {showLoader && (
              <Box sx={{display: "flex", justifyContent: "center", py: 2}}>
                <InfinitySpin/>
              </Box>
          )}

          {isError && !showLoader && (
              <Paper sx={{p: 2}}>
                <Typography variant="body1" sx={{mb: 1}}>
                  Failed to load profile.
                </Typography>
                <Button variant="outlined" onClick={() => refetch()}>
                  Retry
                </Button>
              </Paper>
          )}

          {!showLoader && !isError && data && (
              <Paper sx={{p: 3, borderRadius: 2}}>
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="h6">
                      {data.firstname} {data.lastname}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {data.username}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Role: {data.role}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle1" sx={{mb: 1}}>
                      Vaccinations
                    </Typography>

                    {data.vaccinations.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                          No vaccinations recorded yet.
                        </Typography>
                    ) : (
                        <Box sx={{display: "flex", gap: 1, flexWrap: "wrap"}}>
                          {data.vaccinations.map((v) => (
                              <Tooltip key={v.id} title={v.description} arrow>
                                <Chip label={v.name}/>
                              </Tooltip>
                          ))}
                        </Box>
                    )}
                  </Box>
                  <FormControl sx={{ mt: 2 }}>
                    <FormLabel>Email subscription</FormLabel>
                    <RadioGroup
                        row
                        value={subValue}
                        onChange={(_e, value) => setSubValue(value as "enabled" | "disabled")}
                    >
                      <FormControlLabel value="enabled" control={<Radio />} label="Enabled" />
                      <FormControlLabel value="disabled" control={<Radio />} label="Disabled" />
                    </RadioGroup>

                    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1, mt: 1 }}>
                      <Button
                          variant="outlined"
                          onClick={() => refetch()}
                          disabled={showLoader || isSavingSub}
                      >
                        Reset
                      </Button>
                      <Button
                          variant="contained"
                          disabled={showLoader || isSavingSub || !data}
                          onClick={async () => {
                            const emailSubscribed = subValue === "enabled";
                            await updateSubscription({ emailSubscribed }).unwrap();
                          }}
                      >
                        {isSavingSub ? "Saving..." : "Save"}
                      </Button>
                    </Box>
                  </FormControl>
                </Stack>
              </Paper>
          )}
        </>
      </AuthGuard>
  );
}
