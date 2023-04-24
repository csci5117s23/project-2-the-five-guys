import { useEffect, useState } from "react";
import { getNationalParks } from "@/modules/requests";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import RedirectToHome from "@/components/RedirectToHome";
import { Chip, Stack, TextField, CircularProgress, Button } from "@mui/material";
import dynamic from "next/dynamic";
import myTripStyles from "@/styles/MyTrip.module.css";
import homeStyles from "@/styles/Home.module.css";
import ItineraryList from "../../components/itineraryList";
import EditIcon from "@mui/icons-material/Edit";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";

export default function Home() {
  const [nationalParks, setNationalParks] = useState([]);
  const [pageView, setPageView] = useState("agenda");
  const [loading, setLoading] = useState(true);

  //Dummy data: Need to update this so that it's not intially set and is called in the useEffect to be set from the backend based on trip id
  const [startDate, setStartDate] = ["January 1 2022"];
  const [endDate, setEndDate] = ["Feb 1 2022"];

  //Dummy data: Need to update this so that it's not intially set and is called in the useEffect to be set from the backend based on trip id
  const itineraryData = {
    Day1: {
      places: ["Place A", "Place B", "Place C"],
      description: ["Description A", "Description B", "Description C"],
    },
    Day2: {
      places: ["Place D", "Place E", "Place F"],
      description: ["Description D", "Description E", "Description F"],
    },
    Day3: {
      places: ["Place G", "Place H", "Place I"],
      description: ["Description G", "Description H", "Description I"],
    },
  };
  const [itinerary, setItinerary] = useState(itineraryData);

  // Grab national park data from National Park Service API
  // Need to update this so that it only shows either the image of the map of the trip or the interactive map view itself based on trip id
  useEffect(() => {
    async function loadNationalParkData() {
      let data = await getNationalParks();
      console.log("Data: ", data);
      let filteredParks = data.data.filter((element) => element.designation.includes("National Park"));
      setNationalParks(filteredParks);
      setLoading(false);
    }
    loadNationalParkData();
  }, []);

  // Return loading text if currently loading
  if (loading) {
    return (
      <div className="centered">
        <CircularProgress style={{ color: "#1B742E" }} />
        <div>Loading The Trip...</div>
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
            <Grid item xs={11}>
              {" "}
              <h1 className={myTripStyles.myTrip}>My Trip</h1>
            </Grid>
            <Grid item xs={1}>
              {" "}
              <EditIcon className={myTripStyles.edit} />
            </Grid>
          </Grid>
        </Box>

        <h2 className={myTripStyles.myTrip}>
          {startDate} - {endDate}
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
        {pageView === "agenda" && (
          <div className={myTripStyles.myTrip}>
            <ItineraryList itineraryList={itinerary} />
          </div>
        )}

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
