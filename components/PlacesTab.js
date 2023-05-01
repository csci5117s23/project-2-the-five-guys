import { getParkPlaces, getTrip, updateTrip } from "../modules/requests";
import { useAuth } from "@clerk/nextjs";
import { Snackbar, Alert, Box, Button, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, IconButton, List, ListItem, Stack, TextField, Typography } from "@mui/material";
import PlaceCard from "./PlaceCard";
import { useState, useEffect } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";

export default function PlacesTab({ trip, handleUpdateTrip }) {
  const [searchValue, setSearchValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [dialogPlace, setDialogPlace] = useState({});
  const [dateTime, setDateTime] = useState(null);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState(null);
  const { getToken } = useAuth();
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function loadParkPlaces() {
      let data = await getParkPlaces(trip.parkCode);
      setPlaces(data);
      setLoading(false);
    }
    loadParkPlaces();
  }, [trip]);

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

  function handleSnackClose() {
    setOpen(false);
  }
  const handleCreateOpen = (place) => {
    setDialogPlace(place);
    setNewName(place.title);
    setCreateDialogOpen(true);
  };

  const handleCreateClose = () => {
    setError(null);
    setCreateDialogOpen(false);
  };

  const handleSubmit = async () => {
    if (dialogPlace && dateTime && newName) {
      const itineraryItem = {
        description: "",
        location: newName,
        latitude: dialogPlace.latitude,
        longitude: dialogPlace.longitude,
        startDate: dateTime.toJSON(),
        endDate: dateTime.toJSON(),
        id: uuidv4(),
      };
      const newItinerary = trip.itinerary ? [...trip.itinerary, itineraryItem] : [itineraryItem];
      await handleUpdateTrip(trip._id, { ...trip, itinerary: newItinerary });
      setOpen(true);
      handleCreateClose();
    } else {
      setError("Please fill out the form");
    }
  };

  if (loading) {
    return (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Loading Places...</div>
      </div>
    );
  }
  // Filter national parks by search item
  let filteredPlaces = places.data;
  if (searchValue.length > 0) {
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
          my: 2,
        }}
        onChange={(e) => handleSearch(e)}
      />
      <Button onClick={() => handleCreateOpen({ title: "", latitude: "", longitude: "" })} sx={{ mb: 1 }} variant="contained">
        Create your own place
      </Button>
      <Grid container spacing={2} justifyContent="center">
        {filteredPlaces.map((place) => (
          <Grid item xs={12} md={6} key={place.id}>
            <PlaceCard place={place} handleOpen={handleClickOpen} handleCreateOpen={handleCreateOpen} />
          </Grid>
        ))}
      </Grid>
      <Dialog open={createDialogOpen} onClose={handleCreateClose} fullWidth={true}>
        <DialogTitle>Add to trip</DialogTitle>
        <DialogContent>
          <Stack spacing={2} pt={1}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Name" variant="outlined" value={newName} onChange={(event) => setNewName(event.target.value)} fullWidth />
            <DateTimePicker label="Date and Time" fullWidth value={dateTime} onChange={(newValue) => setDateTime(newValue)} minDate={dayjs(trip.startDate)} maxDate={dayjs(trip.endDate)} />
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
      <Snackbar open={open} autoHideDuration={6000} onClose={handleSnackClose}>
        <Alert onClose={handleSnackClose} severity="success" sx={{ width: "100%" }}>
          Success
        </Alert>
      </Snackbar>
    </>
  );
}
