import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function ItineraryList({ itineraryList }) {
  const [days, setDays] = useState([]);

  useEffect(() => {
    async function extractDays() {
      console.log("Itinerary list: ", itineraryList);
      const events = Object.values(itineraryList).sort((a, b) => {
        const startDateA = new Date(a.startDate);
        const startDateB = new Date(b.startDate);
        const endDateA = new Date(a.endDate);
        const endDateB = new Date(b.endDate);

        if (startDateA.getTime() !== startDateB.getTime()) {
          return startDateA - startDateB;
        }

        if (endDateA.getTime() !== endDateB.getTime()) {
          return endDateA - endDateB;
        }

        return 0;
      });

      console.log("Events: ", events);

      setDays(
        Object.keys(events).map((day) => {
          const startDate = new Date(events[day].startDate);
          const endDate = new Date(events[day].endDate);
          const formattedStartDate = startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          const formattedStartTime = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          const formattedEndDate = endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
          const formattedEndTime = endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
          return (
            <Accordion key={day}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {formattedStartDate} {formattedStartTime} - {formattedEndDate} {formattedEndTime}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Accordion key={events[day].location}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography>{events[day].location}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography>{events[day].description}</Typography>
                    </AccordionDetails>
                  </Accordion>
                </Stack>
              </AccordionDetails>
            </Accordion>
          );
        })
      );
    }
    extractDays();
  }, []);

  return <Stack spacing={2}>{days}</Stack>;
}
