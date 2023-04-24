import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ItineraryList({ itineraryList }) {
  const [days, setDays] = useState([]);

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
                {itineraryList[day].places.map((place, index) => (
                  <Accordion key={place}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{place}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{itineraryList[day].description[index]}</Typography>
                    </AccordionDetails>
                  </Accordion>
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
