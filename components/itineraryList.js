import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography, IconButton, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Divider, ButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useAuth } from "@clerk/nextjs";
import { updateTrip } from "@/modules/requests";

export default function ItineraryList({ itineraryList, tripId, handleUpdateTrip }) {
  const [currentItem, setCurrentItem] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [newItinerary, setNewItinerary] = useState(itineraryList);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newUpdate, setNewUpdate] = useState(false);
  const { getToken } = useAuth();

  //closes the editor for itinerary's descriptions
  function handleCloseEdit() {
    setDialogOpen(false);
  }

  // opens the editor for itinerary's descriptions
  function handleOpenEdit(item) {
    setCurrentItem(item);
    setDialogOpen(true);
  }

  //updates database with PATCH request for itinerary's descriptions. Updates after a second or two (on reload)
  async function handleSubmitEdit(daytoUpdate, description) {
    try {
      const updatedItinerary = itineraryList.map((day) => {
        if (day.id === daytoUpdate.id) {
          return { ...day, description };
        }
        return day;
      });
      await handleUpdateTrip(tripId, { itinerary: updatedItinerary });
      console.log("Updated itenrary: ", updatedItinerary);
      setDialogOpen(false);
      setNewDescription("");
    } catch (error) {
      console.error("submit description error: ", error);
    }
  }

  async function handleDeleteItem(dayToDelete) {
    try {

      console.log("Day to delete: ", dayToDelete);

      const updatedItinerary = newItinerary.filter((day) => (console.log("Day Id check: ", day.id), day.id !== dayToDelete.id));

      await handleUpdateTrip(tripId, { itinerary: updatedItinerary });
    } catch (error) {
      console.error("Delete error: ", error);
    }
  }

  const group = {};
  itineraryList.forEach(item => {
    const date = new Date(item.startDate).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    if (!group[date]) {
      group[date] = [];
    }
    group[date].push(item);
  });

  const sortedDates = Object.keys(group).sort((a, b) => {
    const dateA = new Date(a);
    const dateB = new Date(b);
    return dateA - dateB;
  });

  return (
    <Stack spacing={2} mt={2}>
      {sortedDates.map(date => (
        <Box key={date}>
          <Typography variant="h5">{date}:</Typography>
          <Divider sx={{ my: 1 }} />
          {group[date].sort((a, b) => {
            const dateA = new Date(a.startDate);
            const dateB = new Date(b.startDate);
            return dateA - dateB;
          }).map(item => (
            <Accordion key={item.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  {item.location} - {new Date(item.startDate).toLocaleTimeString("en-us", { hour: "numeric", minute: "2-digit" })}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <ButtonGroup sx={{mb: 1}}>
                  <Button variant="outlined" onClick={() => handleOpenEdit(item)} startIcon={<EditIcon />}>
                    Edit
                  </Button>
                  <Button variant="outlined" onClick={() => handleDeleteItem(item)} startIcon={<DeleteIcon />}>
                    Delete
                  </Button>
                </ButtonGroup>
                <Typography>Description:</Typography>
                <Typography>{item.description}</Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      ))}
      {dialogOpen && (
        <Dialog open={dialogOpen} onClose={handleCloseEdit} BackdropProps={{ invisible: true }}>
          <DialogTitle>Edit Itinerary Description</DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              <TextField label="New Description" multiline fullWidth value={newDescription} onChange={(e) => setNewDescription(e.target.value)} />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={() => handleSubmitEdit(currentItem, newDescription)}>Save</Button>
          </DialogActions>
        </Dialog>
      )}
    </Stack>
  );
}
