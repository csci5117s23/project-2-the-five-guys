import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@clerk/nextjs";
import { updateTrip } from "@/modules/requests";

export default function ItineraryList({ itineraryList, tripId }) {
  const [days, setDays] = useState([]);
  const [day, setEditDay] = useState(-1);
  const [newDescription, setNewDescription] = useState("");
  const [eventValues, setEvents] = useState([]);
  const [newItinerary, setNewItinerary] = useState(itineraryList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUpdate, setNewUpdate] = useState(false);
  const { getToken } = useAuth();

  //closes the editor for itinerary's descriptions
  function handleCloseEditDescription() {
    setDialogOpen(false);
  }

  // opens the editor for itinerary's descriptions
  function handleOpenEditDescription(index) {
    setEditDay(index);
    setDialogOpen(true);
  }

  //updates database with PATCH request for itinerary's descriptions. Updates after a second or two (on reload)
  async function handleSubmitEditDescription(day, description) {
    const token = await getToken({ template: "codehooks" });

    console.log("Submit day check: ", typeof day);
    console.log("Submit description check: ", description);

    const updatedItinerary = eventValues.map((event, index) => {
      console.log("Index: ", index);
      if (index === day) {
        console.log("Event information checking: ", { ...event });
        return { ...event, description };
      }
      console.log("Event information false");
      return event;
    });
    console.log("Updated itinerary: ", updatedItinerary);
    const result = await updateTrip(token, tripId, { itinerary: updatedItinerary });
    setNewItinerary(updatedItinerary);
    setDialogOpen(false);
    setNewUpdate(true);
    console.log("Update check: ", newUpdate);
    setNewDescription("");
  }

  async function handleDeleteDay(day) {
    const token = await getToken({ template: "codehooks" });
    console.log("Day: ", day);

    // console.log("Event values: ", eventValues);
    console.log("Event values again: ", newItinerary);

    const updatedItinerary = newItinerary.filter((event, index) => {
      if (index != day) {
        return event;
      } else {
        return null;
      }
    });

    console.log("Updated Itinerary: ", updatedItinerary);

    const result = await updateTrip(token, tripId, { itinerary: updatedItinerary });
    setNewItinerary(updatedItinerary);
    setNewUpdate(true);
  }

  useEffect(() => {
    console.log("updated value check: ", newUpdate);
    async function extractDays() {
      console.log("Itinerary list: ", newItinerary);

      const events = Object.values(newItinerary).sort((a, b) => {
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

      console.log("Events check: ", events);
      setEvents(events);

      const updatedDays = Object.keys(events).map((day) => {
        // console.log("Day: ", day);
        setEditDay(day);
        const startDate = new Date(events[day].startDate);
        const endDate = new Date(events[day].endDate);
        const formattedStartDate = startDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        const formattedStartTime = startDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        const formattedEndDate = endDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
        const formattedEndTime = endDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
        return (
          <Accordion key={day}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ flexGrow: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Typography>
                      {formattedStartDate} {formattedStartTime} - {formattedEndDate} {formattedEndTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => handleDeleteDay(parseInt(day))}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1}></Grid>
                </Grid>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                <Accordion key={events[day].location}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{events[day].location}</Typography>
                  </AccordionSummary>
                  <Box sx={{ flexGrow: 2 }}>
                    <Grid container spacing={2}>
                      <Grid item xs={11}>
                        <AccordionDetails>
                          <Typography>{events[day].description}</Typography>
                        </AccordionDetails>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton onClick={() => handleOpenEditDescription(day)}>
                          <EditIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                </Accordion>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      });
      setDays(updatedDays);
    }
    extractDays();
  }, [newUpdate]);

  return (
    <Stack spacing={2}>
      {days}
      {dialogOpen && (
        <Dialog open={dialogOpen} onClose={handleCloseEditDescription} BackdropProps={{ invisible: true }}>
          <DialogTitle>Edit Itinerary Description</DialogTitle>
          <DialogContent>
            {console.log("Day check: ", day)}
            {console.log("Event check: ", eventValues)}
            {console.log("Event day check: ", eventValues[day])}
            {console.log("New Description: ", newDescription)}
            <Stack spacing={2} pt={1}>
              <TextField label="New Description" multiline fullWidth value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDescription}>Cancel</Button>
            <Button onClick={() => handleSubmitEditDescription(parseInt(day), newDescription)}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}
