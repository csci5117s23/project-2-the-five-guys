import { Stack, Accordion, AccordionSummary, AccordionDetails, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider, ButtonGroup } from "@mui/material";
import { useState, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs from 'dayjs';

export default function ItineraryList({ itineraryList, trip, handleUpdateTrip, putRequest }) {
  const [currentItem, setCurrentItem] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newDate, setNewDate] = useState(null);

  //closes the editor for itinerary's descriptions
  function handleCloseEdit() {
    setDialogOpen(false);
  }

  // opens the editor for itinerary's descriptions
  function handleOpenEdit(item) {
    setCurrentItem(item);
    setNewDate(dayjs(item.startDate));
    setNewDescription(item.description);
    setDialogOpen(true);
  }

  //updates database with PATCH request for itinerary's descriptions. Updates after a second or two (on reload)
  async function handleSubmitEdit(daytoUpdate, description) {
    try {
      const updatedItinerary = itineraryList.map((day) => {
        if (day.id === daytoUpdate.id) {
          if (newDate) {
            return { ...day, description, startDate: newDate, endDate: newDate };
          } else {
            return { ...day, description };
          }
        }
        return day;
      });
      await handleUpdateTrip(trip._id, { itinerary: updatedItinerary });
      setDialogOpen(false);
      setNewDescription("");
    } catch (error) {
      console.error("submit description error: ", error);
    }
  }

  async function handleDeleteItem(dayToDelete) {
    try {

      const updatedItinerary = itineraryList.filter((day) => (console.log("Day Id check: ", day.id), day.id !== dayToDelete.id));

      await putRequest(trip._id, { ...trip, itinerary: updatedItinerary });
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
        <Dialog open={dialogOpen} onClose={handleCloseEdit} BackdropProps={{ invisible: true }} fullWidth>
          <DialogTitle>Edit Itinerary Description</DialogTitle>
          <DialogContent>
            <Stack spacing={2} pt={1}>
              <DateTimePicker label="New Date and Time" fullWidth value={newDate} onChange={(newValue) => setNewDate(newValue)} minDate={dayjs(trip.startDate)} maxDate={dayjs(trip.endDate)}/>
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
