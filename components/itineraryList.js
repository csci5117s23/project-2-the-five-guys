import { Stack } from "@mui/material";
import { useState, useEffect } from "react";

export default function ItineraryList({ itineraryList }) {
  const [days, setDays] = useState([]);

  // Extracting data from the dummy data
  // Might have to edit this loop depending on how the itineraryList and its days are structured in the actual database
  useEffect(() => {
    async function extractDays() {
      setDays(
        Object.keys(itineraryList).map((day) => (
          <div key={day}>
            <h2>{day}</h2>
            <ul>
              {itineraryList[day].places.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </div>
        ))
      );
    }
    extractDays();
  }, []);

  return <Stack spacing={2}>{days}</Stack>;
}
