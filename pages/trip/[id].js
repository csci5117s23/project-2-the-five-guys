import { useEffect, useState } from "react";
import { getNationalParks, updateTrip } from "@/modules/requests";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import RedirectToHome from "@/components/RedirectToHome";
import { Stack, IconButton, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import dynamic from "next/dynamic";
import myTripStyles from "@/styles/MyTrip.module.css";
import ItineraryList from "../../components/itineraryList";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { fetchItemData } from "../../modules/data";
import { useRouter } from "next/router";
import dayjs from "dayjs";

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

  //updates database with PATCH request for startDate, endDate, title. Updates after a second or two (on reload)
  async function handleSubmitEditName() {
    const token = await getToken({ template: "codehooks" });
    const result = await updateTrip(token, trip._id, { title: newTitle, startDate: newStartDate, endDate: newEndDate });
    setOnOpenEditName(false);
    setNewUpdate(true);
  }
  async function loadData() {
    // console.log("userid: ", userId);
    if (!userId) {
      console.log("No token");
      return;
    }
    console.log("userid: ", userId);
    const token = await getToken({ template: "codehooks" });
    console.log("Token: ", token);
    let data = await getNationalParks();
    console.log("Data: ", data);

    //Need to update this to get the id of the trip from the route
    const tripId = router.query["id"];
    setTripId(tripId);

    //User this dummyID for testing purposes with itinerary until event page is up
    // const tripId = "64496dabe30f5119ffa72a9b";
    // console.log("trip id: ", tripId);
    await fetchItemData(userId, tripId, setTrip, token);
    console.log("New Trip check: ", trip);
    setNewUpdate(false);
  }

  // Grab national park data from National Park Service API
  // Need to update this so that it only shows either the image of the map of the trip or the interactive map view itself based on trip id
  useEffect(() => {
    loadData();
  }, [userId, newUpdate]);

  useEffect(() => {
    async function loadTrip() {
      if (trip) {
        // set trip hooks if title is not null
        if (trip.title) {
          setTitle(trip.title);
          setNewTitle(trip.title);
        }

        const token = await getToken({ template: "codehooks" });
        console.log("Token: ", token);
        let data = await getNationalParks();
        console.log("Data: ", data);

        let filteredParks = data.data.filter((element) => (console.log("Info: ", element.id, trip.nationalPark_id), element.id === trip.nationalPark_id));
        console.log("filtered parks: ", filteredParks);
        setNationalParks(filteredParks);

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
    }
    loadTrip();
  }, [trip]);

  // Return loading text if currently loading
  if (loading) {
    return (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Loading trip...</div>
      </div>
    );
  }

  //leaflet react doest work well with server side rendering(nextjs)
  //credit to fixing the issue: https://stackoverflow.com/questions/57704196/leaflet-with-next-js
  //answer is "answer for 2020"
  const ParkMapComponent = dynamic(() => import("@/components/parkMap"), {
    loading: () => (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Loading Map...</div>
      </div>
    ),
    ssr: false, // line prevents server-side render
  });

  return (
    <>
      <SignedIn>
        <Box sx={{ flexGrow: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {" "}
              <h1 className={myTripStyles.myTrip}>{title}</h1>
            </Grid>
            <Grid item xs={2}>
              {" "}
              {/* <EditIcon className={myTripStyles.edit} /> */}
              <IconButton className={myTripStyles.edit} onClick={handleOpenEditName}>
                <EditIcon />
              </IconButton>
            </Grid>
            <Grid item xs={2}>
              {" "}
              {/* Need to edit this later so that there is a link to the add events page */}
              <IconButton className={myTripStyles.edit}>
                <AddIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Box>

        <h2 className={myTripStyles.myTrip}>
          {overallStartDate} - {overallEndDate}
        </h2>

        {/* Buttons to toggle agenda or map view */}
        <div className={myTripStyles.myTrip}>
          <Button variant="outlined" onClick={() => setPageView("agenda")}>
            {" "}
            Agenda View{" "}
          </Button>
          <Button variant="outlined" onClick={() => setPageView("map")}>
            {" "}
            Map View{" "}
          </Button>
        </div>

        {/* If in agenda view, show itinerary */}
        {pageView === "agenda" && <div className={myTripStyles.myTrip}>{trip.itinerary ? <ItineraryList itineraryList={trip.itinerary} tripId={tripId} loadData={loadData} notes={trip.notes} /> : <h2>No Agenda!</h2>}</div>}

        {/* If in map view, show map */}
        {pageView === "map" && <ParkMapComponent parks={nationalParks} />}
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