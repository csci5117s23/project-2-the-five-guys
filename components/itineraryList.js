import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ItineraryList({ itineraryList }) {
  const [days, setDays] = useState([]);

  // Extracting data from the dummy data
  // Might have to edit this loop depending on how the itineraryList and its days are structured in the actual database
  useEffect(() => {
    async function extractDays() {
      setDays(
        Object.keys(itineraryList).map((day) => (
          <Accordion key={day}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{day}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {itineraryList[day].places.map((place) => (
                  <Typography key={place}>{place}</Typography>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))
      );
    }
    extractDays();
  }, []);

  return <Stack spacing={2}>{days}</Stack>;
}
