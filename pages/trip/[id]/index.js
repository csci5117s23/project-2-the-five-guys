import { useEffect, useState } from "react";
import { getNationalParks, updateTrip } from "@/modules/requests";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import RedirectToHome from "@/components/RedirectToHome";
import { Stack, IconButton, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Container, Typography, List, ListItem, Fab, Tabs, Tab, Divider, Link as MuiLink } from "@mui/material";
import dynamic from "next/dynamic";
import ShareComponent from "@/components/ShareComponent"
import myTripStyles from "@/styles/MyTrip.module.css";
import ItineraryList from "@/components/itineraryList";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fetchItemData, deleteTrip } from "@/modules/data";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { ArrowBack } from "@mui/icons-material";
import Link from "next/link";
import PlacesTab from "../../../components/PlacesTab";
import NotesTab from "../../../components/NotesTab";
import { updateTripPut } from "../../../modules/requests";

export default function Home() {
  const [nationalParks, setNationalParks] = useState([]);
  const [pageView, setPageView] = useState("agenda");
  const [loading, setLoading] = useState(true);
  const { userId, getToken } = useAuth();
  const [overallStartDate, setOverallStartDate] = useState("");
  const [overallEndDate, setOverallEndDate] = useState("");
  const [onOpenEditName, setOnOpenEditName] = useState(false);
  const [newStartDate, setNewStartDate] = useState(null);
  const [newEndDate, setNewEndDate] = useState(null);
  const [newTitle, setNewTitle] = useState("");
  const [title, setTitle] = useState("");
  const [newUpdate, setNewUpdate] = useState(false);
  const [tripId, setTripId] = useState("");
  const [deleting, setDeleting]=useState(false);
  const [park, setPark]=useState(null);
  const [tab, setTab] = useState(0);

  const [trip, setTrip] = useState(null);
  const router = useRouter();

  // closes the editor for name,startDate,endDate
  function handleCloseEditName() {
    setOnOpenEditName(false);
  }

  // opens the editor for name,startDate,endDate
  function handleOpenEditName() {
    setOnOpenEditName(true);
  }

  async function handleTripUpdates(id, updates) {
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const newTrip = await updateTrip(token, trip._id, updates);
        setTrip(newTrip);
      }
  }

   async function handleTripUpdatesPUT(id, updates) {
      const token = await getToken({ template: "codehooks" });
      if (token) {
        const newTrip = await updateTripPut(token, trip._id, updates);
        setTrip(newTrip);
      }
  }

  async function handleDelete(){
    const token = await getToken({ template: "codehooks" });
    const result = await deleteTrip(token, trip._id);
    setDeleting(true);
    router.push("/trips");
  }

  //updates database with PATCH request for startDate, endDate, title. Updates after a second or two (on reload)
  async function handleSubmitEditName() {
    const token = await getToken({ template: "codehooks" });
    const result = await updateTrip(token, trip._id, { title: newTitle, startDate: newStartDate, endDate: newEndDate });
    setOnOpenEditName(false);
    setNewUpdate(true);
  }
  async function loadData() {
    if (!userId) {
      console.log("No token");
      return;
    }
    // console.log("userid: ", userId);
    const token = await getToken({ template: "codehooks" });
    // console.log("Token: ", token);
    let data = await getNationalParks();
    // console.log("Data: ", data);

    let filteredParks = data.data.filter((element) => element.designation.includes("National Park"));
    //Need to update this to get the id of the trip from the route
    const tripId = router.query["id"];
    setTripId(tripId);
    //User this dummyID for testing purposes with itinerary until event page is up
    // const tripId = "64496dabe30f5119ffa72a9b";
    // console.log("trip id: ", tripId);
    await fetchItemData(userId, tripId, setTrip, token);
    // console.log("New Trip check: ", trip);
    setNationalParks(filteredParks);
    setNewUpdate(false);
  }

  // Grab national park data from National Park Service API
  // Need to update this so that it only shows either the image of the map of the trip or the interactive map view itself based on trip id
  useEffect(() => {
    async function loadData() {
      // console.log("userid: ", userId);
      if (!userId) {
        // console.log("NO USER ID");
        return;
      }
      // console.log("userid: ", userId);
      const token = await getToken({ template: "codehooks" });
      console.log("Token: ", token);
      let data = await getNationalParks();
      let filteredParks = data.data.filter((element) => element.designation.includes("National Park"));
      //Need to update this to get the id of the trip from the route
      const tripId = router.query["id"];
      //User this dummyID for testing purposes with itinerary until event page is up
      // const tripId = "6449bf5e3cfb024bad7bb0d4"; MIKKEL'S
      // console.log("trip id: ", tripId);
      await fetchItemData(userId, tripId, setTrip, token);
      setNationalParks(filteredParks);
      setNewUpdate(false);
    }
    loadData();
  }, [userId, newUpdate]);

  useEffect(() => {
    if (trip && nationalParks) {
      nationalParks.map(np => {
        // console.log(np.id);
        if(np.id == trip.nationalPark_id){
          setPark(np)
        }
      });
      // set trip hooks if title is not null
      if (trip.title) {
        setTitle(trip.title);
        setNewTitle(trip.title);
      }

      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);
      const formattedStartDate = startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
      const formattedEndDate = endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

      // set all the date hooks
      setOverallStartDate(formattedStartDate);
      setNewStartDate(trip.startDate);
      setOverallEndDate(formattedEndDate);
      setNewEndDate(trip.endDate);

      setLoading(false);
    }
  }, [trip, nationalParks]);

  // Return loading text if currently loading
  if (loading) {
    return (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Loading trip...</div>
      </div>
    );
  }
  if (deleting) {
    return (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Deleting Trip...</div>
      </div>
    );
  }

  //leaflet react doest work well with server side rendering(nextjs)
  //credit to fixing the issue: https://stackoverflow.com/questions/57704196/leaflet-with-next-js
  //answer is "answer for 2020"
  const ItineraryMap = dynamic(
    () => import('@/components/itineraryMap'),
    {
      loading: () =>
        <div className='centered'>
          <CircularProgress style={{color: "#1B742E"}}/>
          <div>Loading Map...</div>
        </div>,
      ssr: false // line prevents server-side render
    }
  )

  return (
    <>
      <SignedIn>
        <Container>
          <Box sx={{ flexGrow: 2, mt: 2 }}>
            <Stack direction="row" justifyContent="space-between" spacing={2} alignItems="center">
              <IconButton
                aria-label="back"
                size="large"
                onClick={() => {
                  router.back();
                }}
              >
                <ArrowBack style={{ fontSize: "2rem", color: "#1B742E" }} />
              </IconButton>
              <Typography variant="h5">{title}</Typography>
              <Fab color="primary" size="medium" aria-label="edit" onClick={handleOpenEditName} sx={{ flexShrink: 0 }}>
                <EditIcon />
              </Fab>
            </Stack>
          </Box>
          <Stack direction="row" sx={{mt: 1}} divider={<Divider orientation="vertical" flexItem />} spacing={2} alignItems="center" useFlexGap flexWrap="wrap">
            <MuiLink component={Link} href={`/parks/${trip.nationalPark_id}`}>
              {trip.parkName}
            </MuiLink>
            <Typography variant="body1">
              {overallStartDate} - {overallEndDate}
            </Typography>
          </Stack>
          <Stack direction="row" sx={{my: 1}} spacing={2} alignItems="center">
            <ShareComponent start={overallStartDate} end={overallEndDate} trip={trip} park={park} />
            <Button variant="outlined" onClick={handleDelete} startIcon={<DeleteIcon />}>
              Delete Trip
            </Button>
          </Stack>
          <Tabs value={tab} onChange={(event, newValue) => setTab(newValue)} variant="fullWidth">
            <Tab label="Agenda" />
            <Tab label="Places" />
            <Tab label="Map" />
            <Tab label="Notes" />
          </Tabs>

          {/* If in agenda view, show itinerary */}
          {tab === 0 &&
            <div>
              {trip.itinerary ? (
                <ItineraryList putRequest={handleTripUpdatesPUT} itineraryList={trip.itinerary} trip={trip} loadData={loadData} notes={trip.notes} handleUpdateTrip={handleTripUpdates} />
              ) : (
                <Typography variant="body1">No Agenda! Go to the places tab to start planning your trip.</Typography>
              )}
            </div>
          }

          {tab === 1 && <PlacesTab trip={trip} handleUpdateTrip={handleTripUpdates} />}
          {/* If in map view, show map */}
          {tab === 2 && trip.itinerary && <ItineraryMap itinerary={trip} park={nationalParks.filter((element) => element.parkCode === trip.parkCode)[0]} />}
          {tab === 3 && <NotesTab trip={trip} />}
        </Container>

        <Dialog open={onOpenEditName} onClose={handleCloseEditName}>
          <DialogTitle>Edit Trip Details</DialogTitle>
          <DialogContent>
            {/* <DialogContentText> */}
            {/* Edit Trip Details
            </DialogContentText> */}
            <Stack spacing={2} pt={1}>
              <TextField id="name" label="New Title" fullWidth value={newTitle} onChange={(event) => setNewTitle(event.target.value)} />
              <DatePicker label="Start Date" fullWidth value={dayjs(overallStartDate)} onChange={(newValue) => setNewStartDate(newValue.toJSON())} />
              <DatePicker label="End Date" fullWidth value={dayjs(overallEndDate)} onChange={(newValue) => setNewEndDate(newValue.toJSON())} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditName}>Close</Button>
            <Button onClick={handleSubmitEditName}>Submit</Button>
          </DialogActions>
        </Dialog>
      </SignedIn>

      {/* Don't allow non-signed in users to view this page */}
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  );
}
