import { getParkPlaces, getTrip, updateTrip } from "../modules/requests";
import { useAuth } from "@clerk/nextjs";
import { Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import PlaceCard from "./PlaceCard";
import { useState, useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";

export default function PlacesTab({ trip }) {
  //console.log(parkPlaces);
  const [searchValue, setSearchValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [dialogPlace, setDialogPlace] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    async function loadParkPlaces()
    {
      let data = await getParkPlaces(trip.parkCode);
      setPlaces(data);
      setLoading(false);
    }
    loadParkPlaces();
  },[trip]);

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

  if(loading)
  {
    return (
    <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Loading Places...</div>
      </div>
    )
  }
  // Filter national parks by search item
  let filteredPlaces = places.data;
  if(searchValue.length > 0){
    filteredPlaces = places.data.filter((e) => e.title.toLowerCase().includes(searchValue));
  }

  return (
    <>
      <TextField
        id="outlined-basic"
        label="Search for places"
        variant="outlined"
        value={searchValue}
        fullWidth
        sx={{
          boxShadow: 1,
          borderRadius: 2,
          my: 2
        }}
        onChange={(e) => handleSearch(e)}
      />
      <Grid container spacing={2} justifyContent="center">
        {filteredPlaces.map((place) => (
          <Grid item xs={12} md={6} key={place.id}>
            <PlaceCard place={place} handleOpen={handleClickOpen} handleCreateOpen={handleCreateOpen} />
          </Grid>
        ))}
      </Grid>
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
    </>
  );
}
