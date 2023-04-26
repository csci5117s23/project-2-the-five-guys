import { useEffect, useState } from "react";
import { getNationalParks } from "@/modules/requests";
import { SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import RedirectToHome from "@/components/RedirectToHome";
import { Chip, Stack, TextField, CircularProgress, Button } from "@mui/material";
import dynamic from "next/dynamic";
import myTripStyles from "@/styles/MyTrip.module.css";
import homeStyles from "@/styles/Home.module.css";
import ItineraryList from "../../components/itineraryList";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { fetchItemData } from "../../modules/data";
import { useRouter } from "next/router";

export default function Home() {
  const [nationalParks, setNationalParks] = useState([]);
  const [pageView, setPageView] = useState("agenda");
  const [loading, setLoading] = useState(true);
  const { userId, getToken } = useAuth();
  const [overallStartDate, setOverallStartDate] = useState("");
  const [overallEndDate, setOverallEndDate] = useState("");

  const [itinerary, setItinerary] = useState([]);
  const router = useRouter();

  // Grab national park data from National Park Service API
  // Need to update this so that it only shows either the image of the map of the trip or the interactive map view itself based on trip id
  useEffect(() => {
    async function loadData() {
      if (!userId) {
        return;
      }
      console.log("userid: ", userId);
      const token = await getToken({ template: "codehooks" });
      console.log("Token: ", token);
      let data = await getNationalParks();
      console.log("Data: ", data);
      let filteredParks = data.data.filter((element) => element.designation.includes("National Park"));
      //Need to update this to get the id of the trip from the route
      // const tripId = router.query["id"];
      //User this dummyID for testing purposes with itinerary until event page is up
      const tripId = "64496dabe30f5119ffa72a9b";
      console.log("trip id: ", tripId);
      await fetchItemData(userId, tripId, setItinerary, token);
      console.log("Itenary information: ", itinerary);
      if (itinerary != undefined) {
        const startDates = itinerary.map((event) => new Date(event.startDate));
        const endDates = itinerary.map((event) => new Date(event.endDate));
        const earliestStartDate = new Date(Math.min(...startDates)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        const latestEndDate = new Date(Math.max(...endDates)).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        setOverallStartDate(earliestStartDate);
        setOverallEndDate(latestEndDate);
      }
      setNationalParks(filteredParks);
      setLoading(false);
    }
    loadData();
  }, []);

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
  const Map = dynamic(() => import("@/components/map"), {
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
              <h1 className={myTripStyles.myTrip}>My Trip</h1>
            </Grid>
            <Grid item xs={2}>
              {" "}
              <EditIcon className={myTripStyles.edit} />
            </Grid>
            <Grid item xs={2}>
              {" "}
              {/* Need to edit this later so that there is a link to the add events page */}
              <AddIcon className={myTripStyles.edit} />
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
        {pageView === "agenda" && <div className={myTripStyles.myTrip}>{itinerary ? <ItineraryList itineraryList={itinerary} /> : <h2>No Agenda!</h2>}</div>}

        {/* If in map view, show map */}
        {pageView === "map" && <Map parks={nationalParks} />}
      </SignedIn>

      {/* Don't allow non-signed in users to view this page */}
      <SignedOut>
        <RedirectToHome />
      </SignedOut>
    </>
  );
}
