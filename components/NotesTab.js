import { useAuth } from "@clerk/nextjs";
import { Button, TextField, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { updateTrip } from "../modules/requests";

export default function NotesTab({ trip, handleUpdates }) {
  const [newNotes, setNewNotes] = useState(trip.notes);
  const [open, setOpen] = useState(false);

  function handleClose() {
    setOpen(false);
  }
  async function handleNotes() {
    try {
      setOpen(true);
      const response = await handleUpdates(trip._id, { notes: newNotes });
      setNewNotes(response.notes);
    } catch (error) {
      console.error("Notes error: ", error);
    }
  }
  return (
    <>
      <TextField sx={{ my: 2 }} label="Add trip notes here" multiline fullWidth value={newNotes} onChange={(e) => setNewNotes(e.target.value)} />
      <Button variant="contained" onClick={() => handleNotes()}>
        Save
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Success
        </Alert>
      </Snackbar>
    </>
  );
}
