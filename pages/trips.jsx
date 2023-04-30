import {
  Box,
  Divider,
  List,
  ListItem,
  Typography,
  Stack,
  Fab,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  DialogActions,
  Button,
  Autocomplete,
  Alert,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import { getNationalParks, getTrips, createTrip } from "../modules/requests";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import RedirectToHome from "@/components/RedirectToHome";
import TripCard from "../components/TripCard";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function TripListPage({ parks }) {
  const [trips, setTrips] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [park, setPark] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoaded, userId, getToken } = useAuth();

  useEffect(() => {
    const loadTrips = async () => {
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const trips = await getTrips(token);
        setTrips(updateTripList(trips, parks));
        setLoading(false);
      }
    };
    loadTrips();
  }, [isLoaded, userId, getToken, parks]);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setError(null);
    setDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (park && startDate && endDate) {
      const trip = {
        nationalPark_id: park.id,
        parkCode: park.parkCode,
        startDate: startDate.toJSON(),
        endDate: endDate.toJSON()
      };
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const newTrip = await createTrip(token, trip);
        setTrips((prevTrips) => updateTripList([newTrip, ...prevTrips], parks));
        handleClose();
      }
    } else {
      setError("Please fill out the form");
    }
  };

  return (
    <>
      <SignedIn>
        <Box>
          <Container>
            <List>
              <ListItem>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  spacing={2}
                  alignItems="center"
                >
                  <Typography variant="h3">My Trips</Typography>
                  <Fab
                    color="primary"
                    aria-label="add"
                    onClick={handleClickOpen}
                  >
                    <AddIcon />
                  </Fab>
                </Stack>
              </ListItem>
              <Divider />
              <ListItem
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <CircularProgress />
                ) : (
                  <Grid container spacing={2} justifyContent="center">
                    {trips.map((trip) => (
                      <Grid item xs={12} md={6} key={trip._id}>
                        <TripCard trip={trip} />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </ListItem>
            </List>
          </Container>
        </Box>
        <Dialog open={dialogOpen} onClose={handleClose} fullWidth={true}>
          <DialogTitle>New Trip</DialogTitle>
          <DialogContent>
            {error && <Alert severity="error">{error}</Alert>}
            <Stack spacing={2} pt={1}>
              <Autocomplete
                disablePortal
                options={parks}
                getOptionLabel={(park) => park.fullName}
                getOptionSelected={(option, value) =>
                  option.fullName === value.fullName
                }
                renderInput={(params) => (
                  <TextField {...params} label="Park" fullWidth />
                )}
                value={park}
                onChange={(event, newValue) => setPark(newValue)}
              />
              <DatePicker
                label="Start Date"
                fullWidth
                value={startDate}
                onChange={(newValue) => setStartDate(newValue)}
              />
              <DatePicker
                label="End Date"
                fullWidth
                value={endDate}
                onChange={(newValue) => setEndDate(newValue)}
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Trip</Button>
          </DialogActions>
        </Dialog>
      </SignedIn>
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  );
}

const updateTripList = (trips, parks) => {
  return trips.map((trip) => {
    const park = parks.find((park) => park.id === trip.nationalPark_id);
    const { fullName, images } = park;
    const imageUrl = images[0].url;
    return { ...trip, fullName, imageUrl };
  }).sort((a, b) => {
    return new Date(a.startDate) - new Date(b.startDate);
  });
}

export async function getStaticProps() {
  const unfilteredParks = await getNationalParks();
  const parks = unfilteredParks.data.filter((element) => element.designation.includes("National Park"));
  return {
    props: {
      parks,
    },
  };
}
