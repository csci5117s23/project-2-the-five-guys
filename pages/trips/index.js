import { useEffect, useState } from "react";
import { getNationalParks } from "@/modules/requests";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import RedirectToHome from "@/components/RedirectToHome";
import { Chip, Stack, TextField, CircularProgress, Button } from "@mui/material";
import dynamic from "next/dynamic";
import myTripStyles from "@/styles/MyTrip.module.css";
import homeStyles from "@/styles/Home.module.css";

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
    },
    Day2: {
      places: ["Place D", "Place E", "Place F"],
    },
    Day3: {
      places: ["Place G", "Place H", "Place I"],
    },
  };
  const [itinerary, setItinerary] = useState(itineraryData);
  const days = Object.keys(itinerary).map((day) => (
    <div key={day}>
      <h2>{day}</h2>
      <ul>
        {itinerary[day].places.map((place) => (
          <li key={place}>{place}</li>
        ))}
      </ul>
    </div>
  ));
  // Grab national park data from National Park Service API
  // Need to update this so that it only shows either the image of the map of the trip or the interactive map view itself based on trip id
  useEffect(() => {
    async function loadNationalParkData() {
      let data = await getNationalParks();
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
        <h1 className={myTripStyles.myTrip}>My Trip</h1>
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
        {pageView === "agenda" && <div className={myTripStyles.myTrip}>Here's the agenda for today {days}</div>}

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
