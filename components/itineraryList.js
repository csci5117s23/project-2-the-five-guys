import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@clerk/nextjs";
import { updateTrip } from "@/modules/requests";

export default function ItineraryList({ itineraryList, tripId, loadData, notes }) {
  const [days, setDays] = useState([]);
  const [day, setEditDay] = useState(-1);
  const [newDescription, setNewDescription] = useState("");
  const [newItinerary, setNewItinerary] = useState(itineraryList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUpdate, setNewUpdate] = useState(false);
  const { getToken } = useAuth();
  const [newNotes, setNewNotes] = useState(notes);

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
  async function handleSubmitEditDescription(daytoUpdate, description) {
    try {
      const token = await getToken({ template: "codehooks" });
      const updatedItinerary = newItinerary.map((day) => {
        if (day.id === daytoUpdate) {
          return { ...day, description };
        }
        return day;
      });
      await updateTrip(token, tripId, { itinerary: updatedItinerary });
      console.log("Updated itenrary: ", updatedItinerary);
      setNewItinerary(updatedItinerary);
      setNewUpdate(true);
      setDialogOpen(false);
      setNewDescription("");
    } catch (error) {
      console.error("submit description error: ", error);
    }
  }

  async function handleDeleteDay(dayToDelete) {
    try {
      const token = await getToken({ template: "codehooks" });

      console.log("Day to delete: ", dayToDelete);

      const updatedItinerary = newItinerary.filter((day) => (console.log("Day Id check: ", day.id), day.id !== dayToDelete));

      await updateTrip(token, tripId, { itinerary: updatedItinerary });
      console.log("Updated Itinerary: ", updatedItinerary);
      setNewItinerary(updatedItinerary);
      setNewUpdate(true);
    } catch (error) {
      console.error("Delete error: ", error);
    }
  }

  async function handleNotes() {
    try {
      const token = await getToken({ template: "codehooks" });

      await updateTrip(token, tripId, { notes: newNotes });
      setNewUpdate(true);
    } catch (error) {
      console.error("Notes error: ", error);
    }
  }

  useEffect(() => {
    console.log("updated value check: ", newUpdate);
    console.log("new itinerary check: ", newItinerary);

    // loadData();

    setNewUpdate(false);
    async function extractDays() {
      console.log("Itinerary list: ", newItinerary);

      const sortedItinerary = Object.values(newItinerary).sort((a, b) => {
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

      setNewItinerary(sortedItinerary);
      console.log("Events check: ", sortedItinerary);
      const groupedItinerary = {};
      sortedItinerary.forEach((e) => {
        const startDay = new Date(e.startDate).toLocaleDateString();
        const endDay = new Date(e.endDate).toLocaleDateString();

        if (startDay === endDay) {
          // Single day event
          if (!groupedItinerary[startDay]) {
            groupedItinerary[startDay] = [];
          }
          groupedItinerary[startDay].push(e);
        } else {
          // Multi-day event
          const startDate = new Date(e.startDate);
          const endDate = new Date(e.endDate);
          const numDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));

          for (let i = 0; i < numDays; i++) {
            const day = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000).toLocaleDateString();
            if (!groupedItinerary[day]) {
              groupedItinerary[day] = [];
            }
            groupedItinerary[day].push(e);
          }
        }
      });

      console.log("Grouped itienrary: ", groupedItinerary);

      let dayNumber = 0;
      const groupedUpdatedDays = Object.keys(groupedItinerary).map((day) => {
        console.log("group day check: ", day);
        dayNumber = dayNumber + 1;
        const date = new Date(day);
        let formattedDay = date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

        return (
          <Accordion key={dayNumber}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ flexGrow: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={10}>
                    <Typography>
                      Day {dayNumber} ( {formattedDay} )
                    </Typography>
                  </Grid>
                  <Grid item xs={1}>
                    <IconButton onClick={() => handleDeleteDay(dayId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                  <Grid item xs={1}></Grid>
                </Grid>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {groupedItinerary[day].map((event) => {
                  {
                    console.log("group event check: ", event);
                  }
                  return (
                    <Accordion key={event.id}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{event.location}</Typography>
                      </AccordionSummary>

                      <Box sx={{ flexGrow: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={11}>
                            <AccordionDetails>
                              <Typography>{event.description}</Typography>
                            </AccordionDetails>
                          </Grid>
                          <Grid item xs={1}>
                            <IconButton onClick={() => handleOpenEditDescription(event.id)}>
                              <EditIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    </Accordion>
                  );
                })}
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      });

      setDays(groupedUpdatedDays);
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
            {console.log("New Description: ", newDescription)}
            <Stack spacing={2} pt={1}>
              <TextField label="New Description" multiline fullWidth value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDescription}>Cancel</Button>
            <Button onClick={() => handleSubmitEditDescription(day, newDescription)}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
      <TextField label="Log the Trip!" multiline fullWidth value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
      <Button onClick={() => handleNotes()}>Save</Button>
    </Stack>
  );
}
