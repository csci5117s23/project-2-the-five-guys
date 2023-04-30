import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import { getParkPlaces, getTrip, updateTrip } from "../../../modules/requests";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import { Alert, Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import RedirectToHome from "@/components/RedirectToHome";
import PlaceCard from "../../../components/PlaceCard";
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { ArrowBack } from "@mui/icons-material";
import { useRouter } from "next/router";

export default function Places({ parkPlaces, trip }) {
  //console.log(parkPlaces);
  const [searchValue, setSearchValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [dialogPlace, setDialogPlace] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const router = useRouter();


  function handleSearch(e) {
    const input = e.target.value.toString();
    setSearchValue(input);
  }

  const handleClickOpen = (place) => {
    setDialogPlace(place);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleCreateOpen = (place) => {
    setDialogPlace(place);
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setError(null);
    setCreateDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (dialogPlace && startDate && endDate) {
      const itineraryItem = {
        description: dialogPlace.listDescription,
        location: dialogPlace.title,
        latitude: dialogPlace.latitude,
        longitude: dialogPlace.longitude,
        startDate: startDate.toJSON(),
        endDate: endDate.toJSON()
      };
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const newItinerary = trip.itinerary ? [...trip.itinerary, itineraryItem] : [itineraryItem];
        const newTrip = await updateTrip(token, trip._id, {...trip, itinerary: newItinerary});
        trip = newTrip;
        handleCreateClose();
      }
    } else {
      setError("Please fill out the form");
    }
  };

  // Filter national parks by search item
  let filteredPlaces = parkPlaces.data;
  if(searchValue.length > 0){
    filteredPlaces = parkPlaces.data.filter((e) => e.title.toLowerCase().includes(searchValue));
  }

  return (
    <>
      <SignedIn>
        <Box>
          <Container>
            <List>
              <ListItem>
                <IconButton
                  aria-label="back"
                  size="large"
                  onClick={() => {
                    router.back();
                  }}
                >
                  <ArrowBack style={{ fontSize: "2rem", color: "#1B742E" }} />
                </IconButton>
                <Typography variant="h3">Places</Typography>
              </ListItem>
              <Divider />
              <ListItem>
                <TextField
                  id="outlined-basic"
                  label="Search for places"
                  variant="outlined"
                  value={searchValue}
                  fullWidth
                  sx={{
                    boxShadow: 1,
                    borderRadius: 2,
                    margin: "auto",
                  }}
                  onChange={(e) => handleSearch(e)}
                />
              </ListItem>
              <ListItem
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Grid container spacing={2} justifyContent="center">
                  {filteredPlaces.map((place) => (
                    <Grid item xs={12} md={6} key={place.id}>
                      <PlaceCard place={place} handleOpen={handleClickOpen} handleCreateOpen={handleCreateOpen} />
                    </Grid>
                  ))}
                </Grid>
              </ListItem>
            </List>
          </Container>
        </Box>
        <Dialog open={createDialogOpen} onClose={handleCreateClose} fullWidth={true}>
          <DialogTitle>Add &quot;{dialogPlace.title}&quot; to trip?</DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              {error && <Alert severity="error">{error}</Alert>}
              <DateTimePicker label="Start Time" fullWidth value={startDate} onChange={(newValue) => setStartDate(newValue)} />
              <DateTimePicker label="End Time" fullWidth value={endDate} onChange={(newValue) => setEndDate(newValue)} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateClose}>Close</Button>
            <Button onClick={handleSubmit}>Create</Button>
          </DialogActions>
        </Dialog>
        <Dialog open={dialogOpen} onClose={handleClose} fullWidth={true}>
          <DialogTitle>{dialogPlace.title}</DialogTitle>
          <DialogContent>
            <div dangerouslySetInnerHTML={{ __html: dialogPlace.bodyText }} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>
      </SignedIn>
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  );
}

export async function getServerSideProps({ req, res, query }) {
  const { id } = query;
  const { getToken } = getAuth(req);
  const token = await getToken({ template: "codehooks" });
  if (token) {
    const trip = await getTrip(id, token);
    const parkPlaces = await getParkPlaces(trip.parkCode);
    return { props: { ...buildClerkProps(req), parkPlaces, trip } };
  } else {
    res.statusCode = 403;
    return { props: { error: "token not found" } };
  }
}
