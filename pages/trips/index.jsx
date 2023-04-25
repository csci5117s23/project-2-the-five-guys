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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import { useState, useEffect } from "react";
import { getNationalParks, getTrips } from "../../modules/requests";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import RedirectToHome from "@/components/RedirectToHome";
import TripCard from "../../components/TripCard";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

export default function TripListPage({ parks }) {
  const [trips, setTrips] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isLoaded, userId, getToken } = useAuth();

  useEffect(() => {
    const loadTrips = async () => {
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const trips = await getTrips(token);
        const updatedTrips = trips.map((trip) => {
          const park = parks.find((park) => park.id === trip.nationalPark_id);
          const { fullName, images } = park;
          const imageUrl = images[0].url;
          return { ...trip, fullName, imageUrl };
        });
        setTrips(updatedTrips);
      }
    };
    loadTrips();
  }, [isLoaded, userId, getToken, parks]);

  const handleClickOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
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
              <ListItem>
                <Grid container spacing={2} justifyContent="center">
                  {trips.map((trip) => (
                    <Grid item xs={12} md={6} key={trip._id}>
                      <TripCard trip={trip} />
                    </Grid>
                  ))}
                </Grid>
              </ListItem>
            </List>
          </Container>
        </Box>
        <Dialog open={dialogOpen} onClose={handleClose} fullWidth={true}>
          <DialogTitle>New Trip</DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              <Autocomplete
                disablePortal
                options={parks.map((park) => park.fullName)}
                renderInput={(params) => <TextField {...params} label="Park" fullWidth />}
              />
              <DatePicker label="Start Date" fullWidth />
              <DatePicker label="End Date" fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleClose}>Create Trip</Button>
          </DialogActions>
        </Dialog>
      </SignedIn>
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  );
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
